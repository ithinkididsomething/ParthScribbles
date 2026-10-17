import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Game } from '../types';
import { playArcadeSound } from '../lib/arcadeAudio';
import { RotateCcw, Play, Pause, Trophy, Sparkles, Volume2, VolumeX, ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';

interface ArcadeCabinetGameProps {
  game: Game;
  isMuted: boolean;
}

export const ArcadeCabinetGame: React.FC<ArcadeCabinetGameProps> = ({ game, isMuted }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      const val = localStorage.getItem(`crayon_highscore_${game.id}`);
      return val ? parseInt(val, 10) || 0 : 0;
    } catch {
      return 0;
    }
  });
  const [gameState, setGameState] = useState<'playing' | 'gameover' | 'paused'>('playing');

  // Mutable game loop reference
  const gameLoopRef = useRef<{
    animationId: number;
    score: number;
    gameOver: boolean;
    paused: boolean;
    keys: { [key: string]: boolean };
    state: any;
  }>({
    animationId: 0,
    score: 0,
    gameOver: false,
    paused: false,
    keys: {},
    state: {},
  });

  const updateHighScore = useCallback((newScore: number) => {
    setHighScore((prev) => {
      if (newScore > prev) {
        try {
          localStorage.setItem(`crayon_highscore_${game.id}`, newScore.toString());
        } catch {
          // ignore
        }
        return newScore;
      }
      return prev;
    });
  }, [game.id]);

  const restartGame = useCallback(() => {
    const gl = gameLoopRef.current;
    gl.score = 0;
    gl.gameOver = false;
    gl.paused = false;
    setScore(0);
    setGameState('playing');

    // Reset game-specific internal state
    if (game.id === 'gdg-runner') {
      gl.state = {
        playerY: 260,
        playerVY: 0,
        isGrounded: true,
        ducking: false,
        obstacles: [{ x: 600, w: 26, h: 42, type: 'cactus' }],
        particles: [] as any[],
        speed: 5.5,
        tick: 0,
      };
    } else if (game.id === 'flappy-bird-arcade') {
      gl.state = {
        birdY: 180,
        birdVY: 0,
        pipes: [
          { x: 500, top: 120, bottom: 260, passed: false },
          { x: 740, top: 100, bottom: 240, passed: false },
        ],
        particles: [] as any[],
        tick: 0,
      };
    } else if (game.id === 'punk-rock-doodle-jumper') {
      gl.state = {
        playerX: 250,
        playerY: 250,
        playerVX: 0,
        playerVY: -9,
        cameraY: 0,
        platforms: [
          { x: 200, y: 350, w: 100, h: 14, spring: false },
          { x: 120, y: 270, w: 90, h: 14, spring: true },
          { x: 280, y: 190, w: 95, h: 14, spring: false },
          { x: 160, y: 110, w: 85, h: 14, spring: false },
          { x: 300, y: 30, w: 90, h: 14, spring: true },
        ],
        tick: 0,
      };
    } else {
      // nebula-vanguard
      gl.state = {
        shipX: 250,
        shipY: 340,
        lasers: [] as any[],
        asteroids: [
          { x: 120, y: -40, size: 28, speed: 2.2, rot: 0 },
          { x: 320, y: -120, size: 36, speed: 1.8, rot: 0 },
          { x: 220, y: -220, size: 24, speed: 2.5, rot: 0 },
        ],
        particles: [] as any[],
        lastShot: 0,
        tick: 0,
      };
    }
  }, [game.id]);

  useEffect(() => {
    restartGame();
  }, [restartGame]);

  // Main canvas render and update loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gl = gameLoopRef.current;

    const handleKeyDown = (e: KeyboardEvent) => {
      gl.keys[e.code] = true;
      if (['Space', 'ArrowUp', 'ArrowDown'].includes(e.code)) {
        e.preventDefault();
      }
      if (e.code === 'KeyP') {
        gl.paused = !gl.paused;
        setGameState(gl.paused ? 'paused' : 'playing');
      }
      // Action triggers
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        if (gl.gameOver) {
          restartGame();
          return;
        }
        if (game.id === 'gdg-runner' && gl.state.isGrounded) {
          gl.state.playerVY = -12.5;
          gl.state.isGrounded = false;
          playArcadeSound('jump', isMuted);
        } else if (game.id === 'flappy-bird-arcade') {
          gl.state.birdVY = -6.8;
          playArcadeSound('jump', isMuted);
        } else if (game.id === 'nebula-vanguard') {
          if (Date.now() - gl.state.lastShot > 160) {
            gl.state.lasers.push({ x: gl.state.shipX, y: gl.state.shipY - 18 });
            gl.state.lastShot = Date.now();
            playArcadeSound('shoot', isMuted);
          }
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      gl.keys[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Canvas dimensions
    const width = 640;
    const height = 400;
    canvas.width = width;
    canvas.height = height;

    let animId: number;

    const loop = () => {
      if (!gl.paused && !gl.gameOver) {
        // Clear background with crayon notebook tint
        ctx.fillStyle = '#FFFDF7';
        ctx.fillRect(0, 0, width, height);

        // Draw notebook paper lines
        ctx.strokeStyle = 'rgba(214, 211, 209, 0.45)';
        ctx.lineWidth = 1;
        for (let y = 30; y < height; y += 28) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
        // Red notebook margin line
        ctx.strokeStyle = 'rgba(248, 113, 113, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(60, 0);
        ctx.lineTo(60, height);
        ctx.stroke();

        // RUN SPECIFIC GAME LOGIC
        if (game.id === 'gdg-runner') {
          const st = gl.state;
          st.tick++;
          st.speed += 0.0008;

          // Physics
          if (!st.isGrounded) {
            st.playerVY += 0.65;
            st.playerY += st.playerVY;
            if (st.playerY >= 260) {
              st.playerY = 260;
              st.playerVY = 0;
              st.isGrounded = true;
            }
          }

          st.ducking = Boolean(gl.keys['ArrowDown'] || gl.keys['KeyS']);

          // Spawn obstacles
          const lastObstacle = st.obstacles[st.obstacles.length - 1];
          if (!lastObstacle || lastObstacle.x < width - (260 + Math.random() * 200)) {
            const isBird = Math.random() > 0.65 && st.tick > 200;
            st.obstacles.push({
              x: width + 20,
              w: isBird ? 34 : 26,
              h: isBird ? 22 : 44,
              y: isBird ? 220 : 258,
              type: isBird ? 'bird' : 'cactus',
            });
          }

          // Move obstacles
          for (let i = st.obstacles.length - 1; i >= 0; i--) {
            const obs = st.obstacles[i];
            obs.x -= st.speed;

            // Collision check
            const pBox = {
              x: 100,
              y: st.ducking ? st.playerY + 16 : st.playerY,
              w: 32,
              h: st.ducking ? 20 : 36,
            };
            const oY = obs.y !== undefined ? obs.y : 258;
            if (
              pBox.x + pBox.w > obs.x &&
              pBox.x < obs.x + obs.w &&
              pBox.y + pBox.h > oY &&
              pBox.y < oY + obs.h
            ) {
              gl.gameOver = true;
              setGameState('gameover');
              playArcadeSound('hit', isMuted);
              updateHighScore(gl.score);
            }

            if (obs.x < -50) {
              st.obstacles.splice(i, 1);
              gl.score += 10;
              setScore(gl.score);
              if (gl.score % 100 === 0) {
                playArcadeSound('score', isMuted);
              }
            }
          }

          // Draw ground line
          ctx.strokeStyle = '#1C1917';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(0, 296);
          ctx.lineTo(width, 296);
          ctx.stroke();

          // Sketched pebbles on ground
          ctx.fillStyle = '#A8A29E';
          for (let i = 0; i < 6; i++) {
            const px = ((st.tick * st.speed + i * 110) % (width + 40)) - 20;
            ctx.beginPath();
            ctx.arc(width - px, 304, 3, 0, Math.PI * 2);
            ctx.fill();
          }

          // Draw obstacles (sketched cactus or pterodactyl)
          st.obstacles.forEach((obs: any) => {
            const oY = obs.y !== undefined ? obs.y : 258;
            if (obs.type === 'bird') {
              ctx.fillStyle = '#EA580C';
              ctx.strokeStyle = '#1C1917';
              ctx.lineWidth = 2;
              ctx.beginPath();
              ctx.ellipse(obs.x + 16, oY + 10, 16, 9, 0, 0, Math.PI * 2);
              ctx.fill();
              ctx.stroke();
              // Sketched flapping wings
              ctx.beginPath();
              const wingFlap = Math.sin(st.tick * 0.3) * 8;
              ctx.moveTo(obs.x + 10, oY + 10);
              ctx.lineTo(obs.x + 18, oY - 2 + wingFlap);
              ctx.lineTo(obs.x + 24, oY + 10);
              ctx.stroke();
            } else {
              // Crayon Cactus
              ctx.fillStyle = '#16A34A';
              ctx.strokeStyle = '#1C1917';
              ctx.lineWidth = 2.5;
              ctx.beginPath();
              ctx.roundRect(obs.x + 6, oY, 14, 38, 6);
              ctx.fill();
              ctx.stroke();
              // Left arm
              ctx.beginPath();
              ctx.moveTo(obs.x + 6, oY + 16);
              ctx.lineTo(obs.x, oY + 16);
              ctx.lineTo(obs.x, oY + 8);
              ctx.stroke();
              // Right arm
              ctx.beginPath();
              ctx.moveTo(obs.x + 20, oY + 22);
              ctx.lineTo(obs.x + 26, oY + 22);
              ctx.lineTo(obs.x + 26, oY + 14);
              ctx.stroke();
            }
          });

          // Draw GDG Runner Dino Player
          const pY = st.ducking ? st.playerY + 14 : st.playerY;
          ctx.fillStyle = '#2563EB';
          ctx.strokeStyle = '#1C1917';
          ctx.lineWidth = 2.5;

          // Dino body
          ctx.beginPath();
          ctx.roundRect(100, pY, 28, st.ducking ? 20 : 34, 6);
          ctx.fill();
          ctx.stroke();

          // Dino head
          ctx.fillStyle = '#3B82F6';
          ctx.beginPath();
          ctx.roundRect(114, pY - (st.ducking ? 4 : 12), 20, 16, 4);
          ctx.fill();
          ctx.stroke();

          // Crayon eye
          ctx.fillStyle = '#FFFDF7';
          ctx.beginPath();
          ctx.arc(126, pY - (st.ducking ? 0 : 6), 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#1C1917';
          ctx.beginPath();
          ctx.arc(127, pY - (st.ducking ? 0 : 6), 1.5, 0, Math.PI * 2);
          ctx.fill();

          // Sketched running legs
          ctx.strokeStyle = '#1C1917';
          ctx.lineWidth = 2.5;
          const legPhase = Math.sin(st.tick * 0.4) * 6;
          ctx.beginPath();
          ctx.moveTo(106, pY + (st.ducking ? 20 : 34));
          ctx.lineTo(104 + legPhase, 296);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(120, pY + (st.ducking ? 20 : 34));
          ctx.lineTo(122 - legPhase, 296);
          ctx.stroke();

        } else if (game.id === 'flappy-bird-arcade') {
          const st = gl.state;
          st.tick++;
          st.birdVY += 0.38;
          st.birdY += st.birdVY;

          // Ceiling & floor collision
          if (st.birdY < 10 || st.birdY > 370) {
            gl.gameOver = true;
            setGameState('gameover');
            playArcadeSound('hit', isMuted);
            updateHighScore(gl.score);
          }

          // Move pipes
          st.pipes.forEach((p: any) => {
            p.x -= 3.2;

            // Check pass for score
            if (!p.passed && p.x + 50 < 120) {
              p.passed = true;
              gl.score += 1;
              setScore(gl.score);
              playArcadeSound('score', isMuted);
            }

            // Collision check
            const birdBox = { x: 120, y: st.birdY, r: 14 };
            if (birdBox.x + birdBox.r > p.x && birdBox.x - birdBox.r < p.x + 52) {
              if (birdBox.y - birdBox.r < p.top || birdBox.y + birdBox.r > p.bottom) {
                gl.gameOver = true;
                setGameState('gameover');
                playArcadeSound('hit', isMuted);
                updateHighScore(gl.score);
              }
            }

            // Recycle pipe
            if (p.x < -60) {
              p.x = width + 40;
              p.top = 70 + Math.random() * 140;
              p.bottom = p.top + 130;
              p.passed = false;
            }

            // Draw Pipes with sketchy crayon green fill
            ctx.fillStyle = '#22C55E';
            ctx.strokeStyle = '#1C1917';
            ctx.lineWidth = 2.5;

            // Top Pipe
            ctx.beginPath();
            ctx.rect(p.x, 0, 52, p.top);
            ctx.fill();
            ctx.stroke();
            // Top Pipe Lip
            ctx.beginPath();
            ctx.rect(p.x - 4, p.top - 18, 60, 18);
            ctx.fill();
            ctx.stroke();

            // Bottom Pipe
            ctx.beginPath();
            ctx.rect(p.x, p.bottom, 52, height - p.bottom);
            ctx.fill();
            ctx.stroke();
            // Bottom Pipe Lip
            ctx.beginPath();
            ctx.rect(p.x - 4, p.bottom, 60, 18);
            ctx.fill();
            ctx.stroke();
          });

          // Draw Flappy Bird
          ctx.save();
          ctx.translate(120, st.birdY);
          const rot = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, st.birdVY * 0.08));
          ctx.rotate(rot);

          // Yellow crayon body
          ctx.fillStyle = '#EAB308';
          ctx.strokeStyle = '#1C1917';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.ellipse(0, 0, 16, 13, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Sketched wing
          ctx.fillStyle = '#FACC15';
          ctx.beginPath();
          ctx.ellipse(-6, 2, 8, 5, -0.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Orange beak
          ctx.fillStyle = '#EA580C';
          ctx.beginPath();
          ctx.moveTo(12, -2);
          ctx.lineTo(22, 2);
          ctx.lineTo(12, 6);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Eye
          ctx.fillStyle = '#FFF';
          ctx.beginPath();
          ctx.arc(8, -5, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#1C1917';
          ctx.beginPath();
          ctx.arc(9, -5, 2, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();

        } else if (game.id === 'punk-rock-doodle-jumper') {
          const st = gl.state;
          st.tick++;

          // Steering controls
          if (gl.keys['ArrowLeft'] || gl.keys['KeyA']) {
            st.playerVX = -5.5;
          } else if (gl.keys['ArrowRight'] || gl.keys['KeyD']) {
            st.playerVX = 5.5;
          } else {
            st.playerVX *= 0.85;
          }

          st.playerX += st.playerVX;
          // Wrap screen edges
          if (st.playerX < -15) st.playerX = width + 10;
          if (st.playerX > width + 15) st.playerX = -10;

          // Vertical physics
          st.playerVY += 0.38;
          st.playerY += st.playerVY;

          // Camera scrolling upwards
          if (st.playerY < 180) {
            const diff = 180 - st.playerY;
            st.playerY = 180;
            st.cameraY += diff;
            gl.score += Math.round(diff);
            setScore(gl.score);

            // Shift platforms down
            st.platforms.forEach((p: any) => {
              p.y += diff;
            });
          }

          // Platform bouncing
          if (st.playerVY > 0) {
            st.platforms.forEach((p: any) => {
              if (
                st.playerX + 16 > p.x &&
                st.playerX - 16 < p.x + p.w &&
                st.playerY + 20 >= p.y &&
                st.playerY + 20 <= p.y + 16
              ) {
                if (p.spring) {
                  st.playerVY = -16.5;
                  playArcadeSound('bounce', isMuted);
                } else {
                  st.playerVY = -10.5;
                  playArcadeSound('jump', isMuted);
                }
              }
            });
          }

          // Recycle platforms that dropped off bottom
          st.platforms.forEach((p: any) => {
            if (p.y > height + 20) {
              p.y = -20 - Math.random() * 40;
              p.x = 40 + Math.random() * (width - 150);
              p.spring = Math.random() > 0.75;
            }
          });

          // Fall off screen bottom check
          if (st.playerY > height + 40) {
            gl.gameOver = true;
            setGameState('gameover');
            playArcadeSound('hit', isMuted);
            updateHighScore(gl.score);
          }

          // Draw Platforms
          st.platforms.forEach((p: any) => {
            ctx.fillStyle = p.spring ? '#FEF08A' : '#E0E7FF';
            ctx.strokeStyle = '#1C1917';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.roundRect(p.x, p.y, p.w, p.h, 4);
            ctx.fill();
            ctx.stroke();

            // Spring icon doodle
            if (p.spring) {
              ctx.strokeStyle = '#EA580C';
              ctx.lineWidth = 2;
              ctx.beginPath();
              ctx.moveTo(p.x + p.w / 2 - 8, p.y);
              ctx.lineTo(p.x + p.w / 2, p.y - 8);
              ctx.lineTo(p.x + p.w / 2 + 8, p.y);
              ctx.stroke();
            }
          });

          // Draw Punk Jumper Player
          ctx.save();
          ctx.translate(st.playerX, st.playerY);

          // Punk Mohawk Hair (Purple/Pink crayon)
          ctx.fillStyle = '#EC4899';
          ctx.strokeStyle = '#1C1917';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(-6, -16);
          ctx.lineTo(-2, -26);
          ctx.lineTo(2, -16);
          ctx.lineTo(6, -28);
          ctx.lineTo(10, -16);
          ctx.fill();
          ctx.stroke();

          // Body
          ctx.fillStyle = '#6366F1';
          ctx.beginPath();
          ctx.roundRect(-14, -14, 28, 28, 8);
          ctx.fill();
          ctx.stroke();

          // Sunglasses doodle
          ctx.fillStyle = '#1C1917';
          ctx.beginPath();
          ctx.rect(-10, -8, 8, 6);
          ctx.rect(2, -8, 8, 6);
          ctx.fill();

          ctx.restore();

        } else {
          // NEBULA VANGUARD (Space Crayon Shooter)
          const st = gl.state;
          st.tick++;

          // Ship movement
          const speed = 5.5;
          if (gl.keys['ArrowLeft'] || gl.keys['KeyA']) st.shipX = Math.max(30, st.shipX - speed);
          if (gl.keys['ArrowRight'] || gl.keys['KeyD']) st.shipX = Math.min(width - 30, st.shipX + speed);
          if (gl.keys['ArrowUp'] || gl.keys['KeyW']) st.shipY = Math.max(50, st.shipY - speed);
          if (gl.keys['ArrowDown'] || gl.keys['KeyS']) st.shipY = Math.min(height - 40, st.shipY + speed);

          // Move Lasers
          for (let i = st.lasers.length - 1; i >= 0; i--) {
            const l = st.lasers[i];
            l.y -= 9;
            if (l.y < -20) {
              st.lasers.splice(i, 1);
            }
          }

          // Move Asteroids
          st.asteroids.forEach((ast: any) => {
            ast.y += ast.speed;
            ast.rot += 0.02;

            // Collision with lasers
            for (let j = st.lasers.length - 1; j >= 0; j--) {
              const l = st.lasers[j];
              const dist = Math.hypot(l.x - ast.x, l.y - ast.y);
              if (dist < ast.size) {
                // Hit asteroid!
                st.lasers.splice(j, 1);
                ast.y = -60 - Math.random() * 80;
                ast.x = 40 + Math.random() * (width - 80);
                ast.speed = 1.8 + Math.random() * 2.2;
                gl.score += 25;
                setScore(gl.score);
                playArcadeSound('bounce', isMuted);
                break;
              }
            }

            // Collision with ship
            const shipDist = Math.hypot(st.shipX - ast.x, st.shipY - ast.y);
            if (shipDist < ast.size + 14) {
              gl.gameOver = true;
              setGameState('gameover');
              playArcadeSound('hit', isMuted);
              updateHighScore(gl.score);
            }

            // Wrap off bottom
            if (ast.y > height + 60) {
              ast.y = -40;
              ast.x = 40 + Math.random() * (width - 80);
            }
          });

          // Draw Lasers
          ctx.strokeStyle = '#EA580C';
          ctx.lineWidth = 3.5;
          st.lasers.forEach((l: any) => {
            ctx.beginPath();
            ctx.moveTo(l.x, l.y);
            ctx.lineTo(l.x, l.y - 14);
            ctx.stroke();
          });

          // Draw Asteroids (sketched craggy rocks)
          st.asteroids.forEach((ast: any) => {
            ctx.save();
            ctx.translate(ast.x, ast.y);
            ctx.rotate(ast.rot);
            ctx.fillStyle = '#78716C';
            ctx.strokeStyle = '#1C1917';
            ctx.lineWidth = 2.5;

            ctx.beginPath();
            const points = 7;
            for (let i = 0; i < points; i++) {
              const angle = (i / points) * Math.PI * 2;
              const r = ast.size * (0.8 + 0.25 * Math.sin(i * 3));
              const px = Math.cos(angle) * r;
              const py = Math.sin(angle) * r;
              if (i === 0) ctx.moveTo(px, py);
              else ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.restore();
          });

          // Draw Vanguard Rocket Ship
          ctx.save();
          ctx.translate(st.shipX, st.shipY);
          ctx.fillStyle = '#EA580C';
          ctx.strokeStyle = '#1C1917';
          ctx.lineWidth = 2.5;

          // Rocket Body
          ctx.beginPath();
          ctx.moveTo(0, -22);
          ctx.lineTo(14, 16);
          ctx.lineTo(-14, 16);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Cockpit
          ctx.fillStyle = '#38BDF8';
          ctx.beginPath();
          ctx.arc(0, -2, 4.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Thruster flame
          if (Math.random() > 0.3) {
            ctx.fillStyle = '#FACC15';
            ctx.beginPath();
            ctx.moveTo(-6, 16);
            ctx.lineTo(0, 26 + Math.random() * 6);
            ctx.lineTo(6, 16);
            ctx.closePath();
            ctx.fill();
          }

          ctx.restore();
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [game.id, isMuted, restartGame, updateHighScore]);

  // Touch handlers for mobile players
  const handleTouchAction = (action: 'jump' | 'left' | 'right' | 'fire' | 'duck') => {
    const gl = gameLoopRef.current;
    if (gl.gameOver) {
      restartGame();
      return;
    }

    if (action === 'jump') {
      if (game.id === 'gdg-runner' && gl.state.isGrounded) {
        gl.state.playerVY = -12.5;
        gl.state.isGrounded = false;
        playArcadeSound('jump', isMuted);
      } else if (game.id === 'flappy-bird-arcade') {
        gl.state.birdVY = -6.8;
        playArcadeSound('jump', isMuted);
      }
    } else if (action === 'duck') {
      gl.state.ducking = !gl.state.ducking;
    } else if (action === 'left') {
      if (game.id === 'punk-rock-doodle-jumper') gl.state.playerVX = -6.5;
      if (game.id === 'nebula-vanguard') gl.state.shipX = Math.max(30, gl.state.shipX - 35);
    } else if (action === 'right') {
      if (game.id === 'punk-rock-doodle-jumper') gl.state.playerVX = 6.5;
      if (game.id === 'nebula-vanguard') gl.state.shipX = Math.min(610, gl.state.shipX + 35);
    } else if (action === 'fire') {
      if (game.id === 'nebula-vanguard') {
        gl.state.lasers.push({ x: gl.state.shipX, y: gl.state.shipY - 18 });
        playArcadeSound('shoot', isMuted);
      }
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-[#FDFBF7] select-none overflow-hidden">
      {/* Arcade Score Header */}
      <div className="absolute top-4 left-6 right-6 flex items-center justify-between z-20 pointer-events-none">
        <div className="bg-[#FFFDF9] border-2 border-stone-800 px-4 py-1.5 rounded-xl shadow-[3px_3px_0px_#1C1917] flex items-center gap-3">
          <span className="text-xs font-bold text-stone-500 font-sketch uppercase">Score</span>
          <span className="text-xl font-marker text-[#EA580C]">{score}</span>
        </div>

        <div className="bg-[#FFFDF9] border-2 border-stone-800 px-4 py-1.5 rounded-xl shadow-[3px_3px_0px_#1C1917] flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-bold text-stone-500 font-sketch uppercase">Best:</span>
          <span className="text-sm font-marker text-stone-900">{highScore}</span>
        </div>
      </div>

      {/* Main Canvas */}
      <canvas
        ref={canvasRef}
        onClick={() => handleTouchAction('jump')}
        className="w-full max-w-4xl max-h-[65vh] aspect-[16/10] object-contain border-3 border-stone-900 rounded-2xl shadow-[6px_6px_0px_#1C1917] cursor-pointer"
      />

      {/* Game Over Overlay */}
      {gameState === 'gameover' && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-30 animate-fade-in">
          <div className="paper-card bg-[#FFFDF9] p-8 max-w-sm w-full mx-4 text-center border-3 border-stone-900 shadow-[6px_6px_0px_#1C1917]">
            <span className="text-xs font-marker text-[#EA580C] tracking-widest uppercase">SKETCH OVER</span>
            <h3 className="text-3xl font-marker text-stone-900 mt-1 mb-2">Game Over!</h3>
            <p className="text-sm font-sketch text-stone-600 mb-6">
              Final Score: <strong className="text-stone-900 font-marker text-lg">{score}</strong>
              {score >= highScore && score > 0 && (
                <span className="block text-xs text-amber-600 font-bold mt-1">🎉 New High Score!</span>
              )}
            </p>
            <button
              onClick={restartGame}
              className="w-full py-3.5 bg-[#EA580C] text-white font-bold text-base sketchy-btn hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-[3px_3px_0px_#1C1917]"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Play Again (Spacebar)</span>
            </button>
          </div>
        </div>
      )}

      {/* Pause Overlay */}
      {gameState === 'paused' && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-30">
          <div className="paper-card bg-[#FFFDF9] p-6 text-center border-2 border-stone-800">
            <h4 className="text-2xl font-marker text-stone-900 mb-2">Paused</h4>
            <p className="text-xs font-sketch text-stone-600 mb-4">Press 'P' to resume your run</p>
            <button
              onClick={() => {
                gameLoopRef.current.paused = false;
                setGameState('playing');
              }}
              className="px-5 py-2 bg-[#EA580C] text-white text-xs font-bold sketchy-btn"
            >
              Resume Play
            </button>
          </div>
        </div>
      )}

      {/* Mobile Touch Bar Controls */}
      <div className="mt-4 flex items-center justify-center gap-3 w-full max-w-md px-4 sm:hidden">
        {game.id === 'gdg-runner' && (
          <>
            <button
              onClick={() => handleTouchAction('jump')}
              className="flex-1 py-3 bg-[#EA580C] text-white font-bold text-sm sketchy-btn"
            >
              Jump ⬆
            </button>
            <button
              onClick={() => handleTouchAction('duck')}
              className="flex-1 py-3 bg-stone-800 text-white font-bold text-sm sketchy-btn"
            >
              Duck ⬇
            </button>
          </>
        )}

        {game.id === 'flappy-bird-arcade' && (
          <button
            onClick={() => handleTouchAction('jump')}
            className="w-full py-3.5 bg-[#EA580C] text-white font-bold text-base sketchy-btn"
          >
            Tap to Flap Wings 🪶
          </button>
        )}

        {game.id === 'punk-rock-doodle-jumper' && (
          <>
            <button
              onClick={() => handleTouchAction('left')}
              className="flex-1 py-3 bg-stone-800 text-white font-bold text-sm sketchy-btn"
            >
              ◀ Left
            </button>
            <button
              onClick={() => handleTouchAction('right')}
              className="flex-1 py-3 bg-stone-800 text-white font-bold text-sm sketchy-btn"
            >
              Right ▶
            </button>
          </>
        )}

        {game.id === 'nebula-vanguard' && (
          <>
            <button
              onClick={() => handleTouchAction('left')}
              className="px-4 py-3 bg-stone-800 text-white font-bold text-sm sketchy-btn"
            >
              ◀
            </button>
            <button
              onClick={() => handleTouchAction('fire')}
              className="flex-1 py-3 bg-[#EA580C] text-white font-bold text-sm sketchy-btn"
            >
              Fire Laser ⚡
            </button>
            <button
              onClick={() => handleTouchAction('right')}
              className="px-4 py-3 bg-stone-800 text-white font-bold text-sm sketchy-btn"
            >
              ▶
            </button>
          </>
        )}
      </div>
    </div>
  );
};

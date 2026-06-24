export const fontStyles = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

.sp-root {
  font-family: 'Inter', sans-serif;
}

.sp-display {
  font-family: 'Space Grotesk', sans-serif;
}

.sp-mono {
  font-family: 'JetBrains Mono', monospace;
}

.sentiment-gradient {
  background: linear-gradient(
    90deg,
    #ef4565 0%,
    #f5a524 50%,
    #14b8a6 100%
  );
}

@keyframes sp-rise-kf {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
.sp-rise {
  animation: sp-rise-kf 0.35s ease forwards;
}

@keyframes sp-pulse-kf {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.45; transform: scale(0.8); }
}
.sp-pulse {
  animation: sp-pulse-kf 1.6s ease-in-out infinite;
}
`;

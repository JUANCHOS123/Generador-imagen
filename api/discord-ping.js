fetch('https://generador-imagen.vercel.app/api/discord-fix', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ type: 1 })
})
.then(r => r.json())
.then(console.log)
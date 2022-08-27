export default {
  fetch: async req => {
    
    const { pathname, search } = new URL(req.url)
    let perf = []
    
    for (let i = 0; i < 20; i++) {
      const startTime = Date.now()
      const data = await fetch('https:/' + pathname + search, req)
      const time = Date.now() - startTime
      perf.push(time)
    }
    
    console.log(perf)
    const first = perf[0]
    const sorted = perf.sort((a, b) => a - b)
    console.log(sorted)
 
    return new Response(JSON.stringify({
      target: 'https:/' + pathname + search,
      first,
      min: sorted[0],
      max: sorted[19],
      avg: (perf.reduce((acc, x) => acc + x, 0)) / 20,
      med: sorted[9],
      p25: sorted[4],
      p75: sorted[15],
    }, null, 2), { headers: { 'content-type': 'application/json' }})
  }
}

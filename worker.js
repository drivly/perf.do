export default {
  fetch: async (req, env) => {
    
    const { user } = await env.CTX.fetch('https://ctx.do', req).then(res => res.json())
    
    const { pathname, search } = new URL(req.url)
    let perf = []
    
    for (let i = 0; i < 20; i++) {
      const startTime = Date.now()
      const data = await fetch('https:/' + pathname + search, req)
      const time = Date.now() - startTime
      perf.push(time)
    }
    
    const first = perf[0]
    const sorted = perf.sort((a, b) => a - b)
 
    return new Response(JSON.stringify({
      api: {
        icon: '⏱',
        name: 'perf.do',
        description: 'Performance Measurement',
        url: 'https://perf.do',
        endpoints: {
          measure: 'https://perf.do/json.fyi',
        },
        memberOf: 'https://primitives.do',
      },
      perf: {
        target: 'https:/' + pathname + search,
        first,
        min: sorted[0],
        p25: sorted[4],
        med: sorted[9],
        avg: (perf.reduce((acc, x) => acc + x, 0)) / 20,
        p75: sorted[15],
        max: sorted[19],
      },
      user,
    }, null, 2), { headers: { 'content-type': 'application/json; charset=utf-8' }})
  }
}

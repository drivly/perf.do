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
        description: 'Performance Measurement API',
        url: 'https://perf.do/api',
        type: 'https://apis.do/templates',
        endpoints: {
          measure: 'https://perf.do/json.fyi',
        },
        site: 'https://perf.do',
        login: 'https://perf.do/login',
        signup: 'https://perf.do/signup',
        subscribe: 'https://perf.do/subscribe',
        repo: 'https://github.com/drivly/perf.do',
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
      results: perf,
      user,
    }, null, 2), { headers: { 'content-type': 'application/json; charset=utf-8' }})
  }
}

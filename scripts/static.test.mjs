import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import http from 'node:http'
import { once } from 'node:events'
import { buildEvents, publishedEvents } from './build-events.mjs'

const event = { id:'static-event', title:'測試用公告', date:'2026-12-15', published:true }

test('drafts and unpublished metadata never enter the public JSON', () => {
  const source = { events:[{...event,internalNote:'private'}, {...event,id:'draft',title:'不公開的標題',published:false}] }
  const output = publishedEvents(source)
  assert.equal(output.events.length,1)
  assert.equal(output.events[0].title,event.title)
  assert.deepEqual(output.events[0].schedule,[])
  assert.equal(JSON.stringify(output).includes('private'),false)
  assert.equal(JSON.stringify(output).includes('不公開的標題'),false)
  assert.equal(source.events[0].internalNote,'private')
})

test('invalid published content fails the build instead of breaking the public page', () => {
  for(const patch of [{date:'2026-02-30'},{id:'../../secret'},{poster:'/../.env'},{poster:'https://other.invalid/image.jpg'},{schedule:[null]},{time:'25:00'},{stops:[42]}]) {
    assert.throws(()=>publishedEvents({events:[{...event,...patch}]}))
  }
  assert.throws(()=>publishedEvents({events:[event,event]}))
  assert.throws(()=>publishedEvents({events:'invalid'}))
})

test('content build writes static JSON and rejects a missing published cover', async t => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(),'temple-static-'))
  t.after(async()=>{
    assert.ok(path.resolve(root).startsWith(path.resolve(os.tmpdir())+path.sep+'temple-static-'))
    await fs.rm(root,{recursive:true,force:true})
  })
  await fs.mkdir(path.join(root,'content'))
  const source = path.join(root,'content/events.json')
  await fs.writeFile(source,JSON.stringify({events:[event,{...event,id:'draft',published:false}]}))
  await buildEvents(root)
  const output=JSON.parse(await fs.readFile(path.join(root,'public/data/events.json'),'utf8'))
  assert.deepEqual(output.events.map(e=>e.id),[event.id])
  await fs.writeFile(source,JSON.stringify({events:[{...event,poster:'/images/missing.jpg'}]}))
  await assert.rejects(buildEvents(root),{code:'ENOENT'})
})

test('production output is static, contains no admin bundle, and can load without an API', async t => {
  const output = JSON.parse(await fs.readFile('dist/data/events.json','utf8'))
  const source = JSON.parse(await fs.readFile('content/events.json','utf8'))
  assert.deepEqual(output,publishedEvents(source))
  const assets = await fs.readdir('dist/assets')
  assert.ok(!assets.some(name=>/admin/i.test(name)))
  for(const name of assets.filter(name=>name.endsWith('.js'))) {
    const content=await fs.readFile(path.join('dist/assets',name),'utf8')
    assert.equal(content.includes('/api/'),false)
    assert.equal(content.includes('/admin/login'),false)
    assert.equal(content.includes('ADMIN_PASSWORD_HASH'),false)
  }
  for (const forbidden of ['dist/server','dist/content','dist/.env']) await assert.rejects(fs.access(forbidden))
  const config=JSON.parse(await fs.readFile('vercel.json','utf8'))
  assert.equal(config.outputDirectory,'dist')
  assert.ok(config.rewrites.some(r=>r.source==='/(.*)' && r.destination==='/index.html'))
  const server=http.createServer(async(req,res)=>{
    if(req.url!=='/data/events.json') {res.writeHead(404).end();return}
    res.writeHead(200,{'Content-Type':'application/json'})
    res.end(await fs.readFile('dist/data/events.json'))
  })
  server.listen(0,'127.0.0.1');await once(server,'listening')
  t.after(()=>new Promise(resolve=>server.close(resolve)))
  const response=await fetch(`http://127.0.0.1:${server.address().port}/data/events.json`)
  assert.equal(response.status,200)
  assert.deepEqual(await response.json(),output)
})

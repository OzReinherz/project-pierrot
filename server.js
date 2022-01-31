const express = require('express');
const app = express();
const port = 3001;
const pgdb = require('./db/db');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var http = require('http');

/**
 * @type {pgdb.PG}
 */
var db = (async () => { return db = new pgdb.PG(await pgdb.connect()) })();

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

// deleteAlbum
app.post('/adad08a3-7510-5b65-b580-39ba4271e1b7', async (req, res) => {
    if (!(req.body?.owner_id || req.body?.album_id)) return res.status(404);
    // console.log(req.body);
    await db.clientQuery(`delete from album where id = ${req.body?.album_id};`);
    await db.clientQuery(`delete from musica where album_id = ${req.body?.album_id};`);
    await db.clientQuery(`delete from owner where id = ${req.body?.owner_id}`);
    // console.log(t);
    return res.json(true);
});


// getAlbumName
app.post('/8dc52abb-712e-5ad9-93e2-ad823e1f16ae', async (req, res) => {
    let t = req.body?.nome ? await db.clientQuery(`select album.nome, owner.nome as ownerName, cover, ano from album inner join owner on owner_id = owner.id where album.nome = '${req.body.nome}';`) : false;
    // console.log(t);
    return res.json(t);
});

// deleteMusic
app.post('/ea5adc83-bf4f-5c37-932b-cc42afb33a69', async (req, res) => {
    req.body?.nome && req.body?.album_id ? await db.clientQuery(`delete from musica where nome = '${req.body.nome}' AND album_id = ${req.body.album_id}`) : null;
    // console.log(album);
    return res.json(true);
});

// GetAlbum
app.post('/3e377ee1-dd09-5124-936e-5ed83ffb0bf8', async (req, res) => {
    let album = await db.clientQuery('select * from album order by id desc;');

    for (var i=0;i<album.length;i++) {
        album[i]['artist'] = (await db.clientQuery(`select nome from owner where id = ${album[i].owner_id}`))?.[0].nome;
        album[i]['musicas'] = (await db.clientQuery(`select nome from musica where album_id = ${album[i].id}`)).map(m => m.nome);
    }

    // console.log(album);
    return res.json(album);
});

app.post('/73bd3b34-616a-5777-b824-aab1e1ed4371', async (req, res) => {
    let aux = (await db.clientQuery(`select id from owner where nome = '${req.body.artist}';`))?.[0]?.id;

    // console.log(aux);

    let ownerid = aux ? aux : (await db.clientQuery(`insert into owner (nome) values ('${req.body.artist}') returning id`))?.[0]?.id;

    // return console.log(ownerid);

    aux = (await db.clientQuery(`select id from album where nome = '${req.body.name}';`))?.[0]?.id;

    // console.log(`insert into album (nome, owner_id, cover, ano) values ('${req.body.name}', ${ownerid}, '${ req.body?.cover ? req.body?.cover : 'NULL' }', '${ req.body?.year ? req.body?.year : 'NULL' }') returning id;`);

    let albumid = aux ? aux : (await db.clientQuery(`insert into album (nome, owner_id, cover, ano) values ('${req.body.name}', ${ownerid}, '${ req.body?.cover ? req.body?.cover : 'NULL' }', '${ req.body?.year ? req.body?.year : 'NULL' }') returning id;`))?.[0]?.id;

    // console.log(albumid);

    // console.log(req.body);

    aux = await db.clientQuery(`select cover, ano, owner_id from album where id = ${albumid};`);
    console.log(aux);
    aux = { ano: aux[0].ano == 'NULL' ? null : aux[0].ano, cover: aux[0].cover == 'NULL' ? null : aux[0].cover, owner_id: aux[0].owner_id };

    aux.owner_id != ownerid ? await db.clientQuery(`update album set owner_id = ${ownerid} where id = ${albumid};`) : null;

    aux.ano != req.body.year || aux.cover != req.body.cover ? await db.clientQuery(`update album set ano = '${ req.body?.year ? req.body?.year : 'NULL' }', cover = '${ req.body?.cover ? req.body?.cover : 'NULL' }' where id = ${albumid};`) : null;

    aux = await db.clientQuery(`select nome from musica where album_id = ${albumid};`);
    console.log(aux.map(m => m.nome));

    aux?.length > 0 && req.body?.musicas ? req.body.musicas = req.body.musicas.filter(f => !aux.map(m => m?.nome)?.includes(f)) : null;

    req.body?.musicas && req.body?.musicas?.length > 0 ? await db.clientQuery(`insert into musica (nome, album_id) values ${ req.body.musicas.map(m => '(\'' + m +`', ${albumid})`).join(', ') };`) : null;

    res.send(true);
});

let server = http.createServer(app);

server.listen(port, () => {
  console.log(`Database running on port ${port}.`)
})
import $ from 'jquery';
import React from 'react';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { albums: null };
    this.loadingAlbums = this.loadingAlbums.bind(this);

  }

  loadingAlbums() {
    $.post('http://localhost:3001/3e377ee1-dd09-5124-936e-5ed83ffb0bf8', { a: 'a1' }, res => {
      this.setState({ albums: res });
    })
  }

  render() {
    return (
      <div className="ZknfvW d-grid" ref={ this.loadingAlbums }>
    <div className="pzkXNkyhKloG d-grid">
      {/* Start */}
      { this.state.albums?.length > 0 && this.state.albums ? this.state.albums.map(m => (<div className='bLOXBDaMMvTWJbbYhI d-grid' key={m.nome+'_'+m.id}>
      <div className="lbHlRTunagHGkqOhPPN position-relative rounded d-grid align-items-center">
        <div className="BHVjgNdTwTJem position-relative" style={{background: `url('${m.cover}') center / cover no-repeat`}} >
        <i className="fas fa-trash cZryVGRwXNFMYu position-absolute mouse-pointer" onClick={ ev => {
          $.post('http://localhost:3001/adad08a3-7510-5b65-b580-39ba4271e1b7', { album_id: m.id, owner_id: m.owner_id }, res => {
            if (res) this.loadingAlbums();
          });
        } }></i>
        </div>
        <div className="ddnvYQDlfLXAZsMsmtz padding-10 h-100 d-grid align-content-around justify-content-center text-break">
          <p>Album:</p><span>{ m.nome }</span>
          <p>Artista:</p><span>{ m.artist }</span>
          <p>Ano:</p><span>{ m?.ano == 'NULL' ? null : m?.ano }</span>
        </div>
      </div>
      <div className="BWpCOjyT padding-10 rounded d-grid">
        { m?.musicas?.length > 0 ? m.musicas.map(mus => (<div className="RmhuNXGsvWb d-grid align-items-center justify-content-around" key={mus+'_'+m.nome+'_'+m.id}>
          <div className="sjMMKLhBcTIzPXmmILRl rounded" style={{background: `url('${m.cover}') center / cover no-repeat`}} />
          <p>{ mus }</p>
          <p>{ m?.ano == 'NULL' ? null : m?.ano }</p>
          <i className="fas fa-minus-circle iFtHIbeyvZcAhAeVfS mouse-pointer" onClick={ ev => {
            $.post('http://localhost:3001/ea5adc83-bf4f-5c37-932b-cc42afb33a69', { nome: mus, album_id: m.id }, res => {
              // console.log(mus);
              if (res) this.loadingAlbums();
            })
          } }></i>
        </div>)) : (<h5 style={{ textAlign: 'center' }}>Nada Aqui</h5>) }
      </div>
    </div>)) : null }
      {/* Content END */}
    </div>
    <div className="biDZQqft rounded padding-10 d-grid">
      <div className="sIhXJnGsNVwT">
        <h5>Album</h5>
        <div id='SledGqWVwssonrSs' className="zSMQRShKyDcnCLURFhP d-grid align-items-center">
          <p className="fw-bold">Nome:</p><input name='name' className="BtWYCQTtbfsTgU rounded padding-5" type="text" placeholder="Nome" required onKeyUp={ ev => {
            // console.log($(ev.currentTarget).val());
            if ($(ev.currentTarget).val().length > 0) {
              $.post('http://localhost:3001/8dc52abb-712e-5ad9-93e2-ad823e1f16ae', { nome: $(ev.currentTarget).val() }, res => {
                console.log(res.length > 0);
                if (res?.length > 0) {
                  let e = $(ev.target).parent();
                  e.find('input[name="artist"]').val(res[0].ownername);
                  e.find('input[name="cover"]').val(res[0].cover == 'NULL' ? null : res[0].cover);
                  e.find('input[name="year"]').val(res[0].ano == 'NULL' ? null : res[0].ano);
                }
              })
            }
          } } />
          <p className="fw-bold">Artista:</p><input name='artist' className="BtWYCQTtbfsTgU rounded padding-5" type="text" placeholder="Artista" required />
          <p className="fw-bold">Capa (URL):</p><input name='cover' className="BtWYCQTtbfsTgU rounded padding-5" type="text" placeholder="Link" />
          <p className="fw-bold">Ano:</p><input name='year' className="BtWYCQTtbfsTgU rounded padding-5" type="text" placeholder="Ano" />
        </div>
      </div>
      <div className="sIhXJnGsNVwT d-grid">
        <h5>Musicas</h5>
        <div id='sTUpiXSYLS' className="zSMQRShKyDcnCLURFhP d-grid align-items-center">
          <i className="fas fa-plus-circle mouse-pointer" onClick={ ev => {
            $(ev.target).before('<input class="BtWYCQTtbfsTgU rounded padding-5 top-0" type="text" placeholder="Nome" required />');
          } } style={{ width: 'max-content' }} />
        </div>
        <button type="button" className="btn btn-outline-secondary" onClick={ ev => getAlbum(ev, this) }>Salvar</button>
      </div>
    </div>
  </div>
  
    );
  }
}

function getAlbum(ev, AppClass) {
  var obj = {};

  try {
    $(ev.currentTarget).closest('.biDZQqft').find('#SledGqWVwssonrSs input').each((ind, ele) => {
      if ($(ele).attr('required') && !$(ele).val()) {
        let bg = $(ele).css('background');

        if ($(ele).css('background') == 'rgb(98, 33, 33) none repeat scroll 0% 0% / auto padding-box border-box') throw 'required null';
  
        $(ele).css('background', '#622121');
        $(ele).focusin(ev => {
          $(ele).css('background', bg)
          $(ele).off(ev);
        })
        throw 'required null';
      }
  
      obj[$(ele).attr('name')] = $(ele).val().length == 0 ? null : $(ele).val();
    })
  } catch(error) {
    return null;
  }

  $(ev.currentTarget).closest('.biDZQqft').find('#sTUpiXSYLS input').each((ind, ele) => {
    if (!obj?.musicas) obj['musicas'] = [];

    if ($(ele).val()) obj.musicas.push($(ele).val());
  })

  if (obj?.musicas && obj?.musicas.length == 0) delete obj?.musicas;

  $.post('http://localhost:3001/73bd3b34-616a-5777-b824-aab1e1ed4371', obj, res => {
    if (res) AppClass.loadingAlbums();
  });
}

export default App;


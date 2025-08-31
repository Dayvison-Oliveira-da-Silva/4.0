function renderCarrinhoProposta() {
  let carrinhoProposta_itens = JSON.parse(localStorage.getItem('carrinhoProposta_itens')) || [];
  let html = '';
  if (!carrinhoProposta_itens.length) {
    html = `<div class="carrinhoProposta-vazio">Seu carrinho está vazio :(</div>`;
  } else {
    html = `
    <table class="carrinhoProposta-tabela">
      <thead>
        <tr>
          <th class="carrinhoProposta-th">SKU</th>
          <th class="carrinhoProposta-th">Qtd</th>
          <th class="carrinhoProposta-th">Preço (un)</th>
          <th class="carrinhoProposta-th">Total</th>
          <th class="carrinhoProposta-th"></th>
        </tr>
      </thead>
      <tbody>
        ${carrinhoProposta_itens.map((item, idx) => `
          <tr>
            <td class="carrinhoProposta-td">${item.sku}</td>
            <td class="carrinhoProposta-td">${item.quantidade}</td>
            <td class="carrinhoProposta-td">R$ ${Number(item.preco).toFixed(2)}</td>
            <td class="carrinhoProposta-td">R$ ${(Number(item.preco) * Number(item.quantidade)).toFixed(2)}</td>
            <td class="carrinhoProposta-td">
              <button class="remover-carrinho" data-idx="${idx}" style="background:#e74c3c;color:#fff;padding:4px 10px;border-radius:7px;border:none;cursor:pointer;">remover</button>
            </td>
          </tr>
        `).join('')}
        <tr>
          <td class="carrinhoProposta-td" colspan="3" style="text-align:right;font-weight:bold;">TOTAL</td>
          <td class="carrinhoProposta-td" style="font-weight:bold;">R$ ${carrinhoProposta_itens.reduce((a, b) => a + Number(b.preco) * Number(b.quantidade), 0).toFixed(2)}</td>
          <td class="carrinhoProposta-td"></td>
        </tr>
      </tbody>
    </table>
    `;
  }
  document.getElementById('carrinhoProposta-cart').innerHTML = html;

  // Evento remover item
  document.querySelectorAll('.remover-carrinho').forEach(btn => {
    btn.onclick = function() {
      let idx = parseInt(this.dataset.idx, 10);
      let itens = JSON.parse(localStorage.getItem('carrinhoProposta_itens')) || [];
      itens.splice(idx, 1);
      localStorage.setItem('carrinhoProposta_itens', JSON.stringify(itens));
      renderCarrinhoProposta();
    }
  });
}
renderCarrinhoProposta();

window.addEventListener("storage", (e) => {
  if (e.key === "carrinhoProposta_itens") renderCarrinhoProposta();
});

// ------------------------ FORMULÁRIO ------------------------
const carrinhoProposta_nome = document.getElementById('carrinhoProposta-nome');
const carrinhoProposta_tipo = document.getElementById('carrinhoProposta-tipo');
const carrinhoProposta_cpfcnpj = document.getElementById('carrinhoProposta-cpfcnpj');
const carrinhoProposta_btnProposta = document.getElementById('carrinhoProposta-btn-proposta');
const carrinhoProposta_btnPedido = document.getElementById('carrinhoProposta-btn-pedido');
const carrinhoProposta_msg = document.getElementById('carrinhoProposta-msg');

function carrinhoProposta_validarProposta() {
  return carrinhoProposta_nome.value.trim().length >= 2;
}
function carrinhoProposta_validarPedido() {
  let ok = carrinhoProposta_nome.value.trim().length >= 2;
  ok = ok && carrinhoProposta_tipo.value && carrinhoProposta_cpfcnpj.value.trim().length >= 11;
  return ok;
}
function carrinhoProposta_feedbackBotao() {
  carrinhoProposta_btnProposta.disabled = !carrinhoProposta_validarProposta();
  carrinhoProposta_btnPedido.disabled = !carrinhoProposta_validarPedido();
}
carrinhoProposta_nome.oninput = carrinhoProposta_tipo.onchange = carrinhoProposta_cpfcnpj.oninput = carrinhoProposta_feedbackBotao;
window.onload = carrinhoProposta_feedbackBotao;

carrinhoProposta_btnProposta.onclick = () => {
  if (!carrinhoProposta_validarProposta()) {
    carrinhoProposta_showMsg("Informe ao menos o nome do cliente.", true); return;
  }
  carrinhoProposta_showMsg("Proposta salva com sucesso! <b>Você pode transformar em pedido depois.</b>", false);
  // Aqui você pode salvar em localStorage/DB/JSON
};
carrinhoProposta_btnPedido.onclick = () => {
  if (!carrinhoProposta_validarPedido()) {
    carrinhoProposta_showMsg("Para pedido de venda preencha Nome, Tipo de Pessoa e CPF/CNPJ.", true); return;
  }
  carrinhoProposta_showMsg("Pedido de venda gerado com sucesso! <b>Enviado para o sistema!</b>", false);
  // Aqui você pode integrar ao Tiny ou outro ERP
};
function carrinhoProposta_showMsg(texto, erro = false) {
  carrinhoProposta_msg.innerHTML = texto;
  carrinhoProposta_msg.className = 'carrinhoProposta-msg' + (erro ? ' carrinhoProposta-erro' : '');
  carrinhoProposta_msg.style.display = 'flex';
  setTimeout(() => { carrinhoProposta_msg.style.display = 'none'; }, 4000);
}

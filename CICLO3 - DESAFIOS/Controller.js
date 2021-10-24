const express = require('express');
const cors = require('cors');
const {Sequelize} = require('./models');
const models = require('./models');
const app = express();

app.use(cors());
app.use(express.json());

// VARIÁVEIS DE ASSOCIAÇÃO DAS MODELS
let cliente=models.Cliente;
let itempedido = models.ItemPedido;
let pedido = models.Pedido;
let servico = models.Servico;
let compra = models.Compra;
let produto = models.Produto;
let itemcompra = models.ItemCompra;

///////////////////////////////////////////// MENSAGEM ROTA RAIZ
app.get('/', function(req, res){
    res.send('<h1>Olá, <strong>mundo!</strong></h1><br><h3>Seja bem vindo a <strong>TI Services!</strong></h3>')
});

//////////////////////////////////////////////////////// CLIENTE

// Cadastrar Cliente
app.post('/clientes', async(req, res)=>{
    await cliente.create(
        req.body
    ).then(function(){
        return res.json({
            erro: false,
            message: "Cliente criado com sucesso!"
        })
    }).catch(function(erro){
        return res.status(400).json({
            erro: true,
            message: "Erro ao criar Cliente!"
        })
    });
});

// Listar todos os Clientes
app.get('/clientes/lista', async(req, res)=>{
    await cliente.findAll({
        //raw: true
        order: [['clienteDesde', 'ASC']]
    }).then(function(clientes){
        res.json({clientes})
    });
});

// Listar quantidade de Clientes
app.get('/clientes/quantidade', async(req, res)=>{
    await cliente.count('id')
    .then(function(clientes){
        res.json({
            erro: false,
            clientes
        });
    }).catch(function(erro){
        return res.status(400).json({
            erro: true,
            message: "Erro ao exibir a quantidade de clientes"
        });
    });
});

// Listar um único Cliente
app.get('/clientes/:id', async(req, res)=>{
    if(!await cliente.findByPk(req.params.id)){
        return res.status(400).json({
            erro: true,
            message: "Cliente não encontrado."
        });
    };
    await cliente.findByPk(req.params.id)
    .then(cliente=>{
        return res.json({
            erro: false,
            cliente
        });
    }).catch(function(erro){
        return res.status(400).json({
            erro: true,
            message: "Erro: não foi possível conectar."
        });
    });
});

// Lista todos os Pedidos do Cliente X
app.get('/clientes/:id/pedidos', async(req, res)=>{
    if(!await cliente.findByPk(req.params.id)){
        return res.status(400).json({
            erro: true,
            message: "Cliente não encontrado."
        });
    };
    await pedido.findAll({
        where: {ClienteId: req.params.id} 
    }).then(function(pedidos){
        return res.json({
            erro: false,            
            pedidos
        });
    }).catch(function(erro){
        return res.status(400).json({
            erro: true,
            message: "Erro ao encontrar pedidos."
        });
    });
});

// Editar Cliente
app.put('/clientes/:id/editar', async(req, res)=>{
    if(!await cliente.findByPk(req.params.id)){
        return res.status(400).json({
            erro: true,
            message: "Cliente não encontrado."
        });
    };
    const cli={
        nome: req.body.nome,
        endereco: req.body.endereco,
        cidade: req.body.cidade,
        uf: req.body.uf,
        nascimento: req.body.nascimento,
        clienteDesde: req.body.clienteDesde
    };
    await cliente.update(cli,{
        where: {id: req.params.id}
    }).then(function(){
        return res.json({
            erro: false,
            message: "Cliente alterado com sucesso!"
        });
    }).catch(function(erro){
        return res.status(400).json({
            erro: true,
            message: "Erro ao alterar o cliente."
        });
    });
});

// Excluir Cliente
app.get('/clientes/:id/excluir', async(req, res)=>{
    if(!await cliente.findByPk(req.params.id)){
        return res.status(400).json({
            erro: true,
            message: "Cliente não encontrado."
        });
    };
    await cliente.destroy({
        where: {id: req.params.id}
    }).then(function(){
        return res.json({
            erro: false,
            message: "Cliente excluído com sucesso!"
        });
    }).catch(function(erro){
        return res.status(400).json({
            erro: true,
            message: "Erro ao excluir o cliente."
        });
    });
});

//////////////////////////////////////////////////////// PEDIDO

// Cadastrar Pedido
app.post('/pedidos', async(req, res)=>{
    await pedido.create(
        req.body
    ).then(function(){
        return res.json({
            erro: false,
            message: "Pedido criado com sucesso!"
        })
    }).catch(function(erro){
        return res.status(400).json({
            erro: true,
            message: "Erro ao criar Pedido!"
        })
    });
});

// Listar todos os Pedidos
app.get('/pedidos/lista', async(req, res)=>{
    await pedido.findAll({
        raw: true
    }).then(function(pedidos){
        res.json({pedidos})
    });
});

// Listar quantidade de Pedidos
app.get('/pedidos/quantidade', async(req, res)=>{
    await pedido.count('id')
    .then(function(pedidos){
        res.json({
            erro: false,
            pedidos
        });
    }).catch(function(erro){
        return res.status(400).json({
            erro: true,
            message: "Erro ao exibir a quantidade de pedidos"
        });
    });
});

// Listar um único Pedido
app.get('/pedidos/:id', async(req, res)=>{
    if(!await pedido.findByPk(req.params.id)){
        return res.status(400).json({
            erro: true,
            message: "Pedido não encontrado."
        });
    };
    await pedido.findByPk(req.params.id,{include: [{all: true}]})
    .then(ped=>{
        return res.json({
            erro: false,
            ped
        });
    }).catch(function(erro){
        return res.status(400).json({
            erro: true,
            message: "Erro ao buscar o pedido."
        });
    });
});

// Editar Pedido - Mudar: data
app.put('/pedidos/:id/editar', async(req, res)=>{
    if(!await pedido.findByPk(req.params.id)){
        return res.status(400).json({
            erro: true,
            message: "Pedido não encontrado."
        });
    };
    const reqped={
        data: req.body.data
    };
    await pedido.update(reqped,{
        where: {id: req.params.id}
    }).then(function(){
        return res.json({
            erro: false,
            message: "Pedido alterado com sucesso!"
        });
    }).catch(function(erro){
        return res.status(400).json({
            erro: true,
            message: "Erro ao alterar o pedido."
        });
    });
});

// Excluir Pedido
app.get('/pedidos/:id/excluir', async(req, res)=>{
    if(!await pedido.findByPk(req.params.id)){
        return res.status(400).json({
            erro: true,
            message: "Pedido não encontrado."
        });
    };
    await pedido.destroy({
        where: {id: req.params.id}
    }).then(function(){
        return res.json({
            erro: false,
            message: "Pedido excluído com sucesso!"
        });
    }).catch(function(erro){
        return res.status(400).json({
            erro: true,
            message: "Erro ao excluir o pedido."
        });
    });
});

//////////////////////////////////////////////////////// ITEMPEDIDO

// Cadastrar ItemPedido
app.post('/itempedido', async(req, res)=>{
    await itempedido.create(
        req.body
    ).then(function(){
        return res.json({
            erro: false,
            message: "Item adicionado ao pedido com sucesso!"
        })
    }).catch(function(erro){
        return res.status(400).json({
            erro: true,
            message: "Erro ao adicionar o item ao pedido."
        })
    });
});

// Listar todos os ItemPedido
app.get('/itempedido/lista', async(req, res)=>{
    await itempedido.findAll({
        raw: true
    }).then(function(itens){
        res.json({itens})
    });
});

// Listar quantidade de ItemPedido
app.get('/itempedido/quantidade', async(req, res)=>{
    await itempedido.count('id')
    .then(function(itens){
        res.json({
            erro: false,
            itens
        });
    }).catch(function(erro){
        return res.status(400).json({
            erro: true,
            message: "Erro ao exibir a quantidade de Item Pedido"
        });
    });
});

// Listar um único ItemPedido
app.get('/itempedido/:id', async(req, res)=>{
    if(!await itempedido.findByPk(req.params.id)){
        return res.status(400).json({
            erro: true,
            message: "Item Pedido não encontrado."
        });
    };
    await itempedido.findByPk(req.params.id)
    .then(itens=>{
        return res.json({
            erro: false,
            itens
        });
    }).catch(function(erro){
        return res.status(400).json({
            erro: true,
            message: "Erro: não foi possível conectar."
        });
    });
});

// Editar ItemPedido - Mudar: quantidade e valor
app.put('/itempedido/:id/editar', async(req, res)=>{
    const item={
        quantidade: req.body.quantidade,
        valor: req.body.valor
    };
    if (!await pedido.findByPk(req.params.id)){
        return res.status(400).json({
            erro: true,
            message: "Pedido não foi encontrado."
        });
    };
    if(!await servico.findByPk(req.body.ServicoId)){
        return res.status(400).json({
            erro: true,
            message: 'Serviço não foi encontrado'
        });
    };
    await itempedido.update(item,{
        where: Sequelize.and({ServicoId: req.body.ServicoId},
            {PedidoId: req.params.id})
    }).then(function(itens){
        return res.json({
            erro: false,
            message: "Pedido foi alterado com sucesso",
            itens
        });
    }).catch(function(erro){
        return res.status(400).json({
            erro: true,
            message: "Erro: não foi possivel alterar."
        });
    });
});

// Excluir ItemPedido do Pedido X
app.get('/pedidos/:id/item/excluir', async(req, res)=>{
    if(!await pedido.findByPk(req.params.id)){
        return res.status(400).json({
            erro: true,
            message: "Pedido não encontrado."
        });
    };
    await itempedido.destroy({        
        where: Sequelize.and({
            ServicoId: req.body.ServicoId, 
            PedidoId: req.params.id
        })
    }).then(function(){
        return res.json({
            erro: false,
            message: "Item excluído com sucesso!"
        });
    }).catch(function(erro){
        return res.status(400).json({
            erro: true,
            message: "Erro ao excluir o item."
        });
    });
});

//////////////////////////////////////////////////////// SERVIÇOS

// Cadastrar Serviço
app.post('/servicos', async(req, res)=>{
    await servico.create(
        req.body
    ).then(function(){
        return res.json({
            erro: false,
            message: "Serviço criado com sucesso!"
        })
    }).catch(function(erro){
        return res.status(400).json({
            erro: true,
            message: "Erro ao criar serviço!"
        })
    });
});

// Listar todos os Serviços
app.get('/servicos/lista', async(req, res)=>{
    await servico.findAll({
        //raw: true
        order: [['nome', 'ASC']]
    }).then(function(servicos){
        res.json({servicos})
    });
});

// Listar quantidade de Serviços
app.get('/servicos/quantidade', async(req, res)=>{
    await servico.count('id')
    .then(function(servicos){
        res.json({
            erro: false,
            servicos
        });
    }).catch(function(erro){
        return res.status(400).json({
            erro: true,
            message: "Erro ao exibir a quantidade de Serviços"
        });
    });
});

// Listar um único Serviço
app.get('/servicos/:id', async(req, res)=>{
    if(!await servico.findByPk(req.params.id)){
        return res.status(400).json({
            erro: true,
            message: "Serviço não encontrado."
        });
    };
    await servico.findByPk(req.params.id)
    .then(servicos=>{
        return res.json({
            erro: false,
            servicos
        });
    }).catch(function(erro){
        return res.status(400).json({
            erro: true,
            message: "Erro: não foi possível conectar."
        });
    });
});

// Listar os pedidos com o Serviço X
app.get('/servicos/:id/pedidos', async(req, res)=>{
    if(!await servico.findByPk(req.params.id)){
        return res.status(400).json({
            erro: true,
            message: "Serviço não encontrado."
        });
    };
    await servico.findByPk(
        req.params.id,{include: [{all: true}]})
    .then(servicos=>{
        return res.json({
            erro: false,
            servicos
        });
    }).catch(function(erro){
        return res.status(400).json({
            erro: true,
            message: "Erro ao buscar o serviço."
        });
    });
});

// Editar Serviço - Mudar: nome e/ou descrição
app.put('/servicos/:id/editar', async(req, res)=>{
    if(!await servico.findByPk(req.params.id)){
        return res.status(400).json({
            erro: true,
            message: "Serviço não encontrado."
        });
    };
    const servs ={
        nome: req.body.nome,
        descricao: req.body.descricao
    }
    await servico.update(servs,{
        where: {id: req.params.id}
    }).then(function(){
        return res.json({
            erro: false,
            message: "Serviço alterado com sucesso!"
        });
    }).catch(function(erro){
        return res.status(400).json({
            erro: true,
            message: "Erro ao alterar o serviço."
        });
    });
});

// Excluir Serviço
app.get('/servicos/:id/excluir', async(req, res)=>{
    if(!await servico.findByPk(req.params.id)){
        return res.status(400).json({
            erro: true,
            message: "Serviço não encontrado."
        });
    };
    await servico.destroy({
        where: {id: req.params.id}
    }).then(function(){
        return res.json({
            erro: false,
            message: "Serviço excluído com sucesso!"
        });
    }).catch(function(erro){
        return res.status(400).json({
            erro: true,
            message: "Erro ao excluir o serviço."
        });
    });
});

//////////////////////////////////////////////////////// COMPRA

// Cadastrar Compra
app.post('/compras', async(req, res)=>{
    await compra.create(
        req.body
    ).then(function(){
        return res.json({
            erro: false,
            message: "Compra criada com sucesso!"
        })
    }).catch(function(erro){
        return res.status(400).json({
            erro: true,
            message: "Erro ao criar Compra!"
        })
    });
});

// Listar todas as Compras
app.get('/compras/lista', async(req, res)=>{
    await compra.findAll({
        raw: true
    }).then(function(compras){
        res.json({compras})
    });
});

// Listar quantidade de Compras
app.get('/compras/quantidade', async(req, res)=>{
    await compra.count('id')
    .then(function(compras){
        res.json({
            erro: false,
            compras
        });
    }).catch(function(erro){
        return res.status(400).json({
            erro: true,
            message: "Erro ao exibir a quantidade de Compras"
        });
    });
});

// Listar uma única Compra
app.get('/compras/:id', async(req, res)=>{
    if(!await compra.findByPk(req.params.id)){
        return res.status(400).json({
            erro: true,
            message: "Compra não encontrada."
        });
    };
    await compra.findByPk(req.params.id,{include: [{all: true}]})
    .then(compra=>{
        return res.json({
            erro: false,
            compra
        });
    }).catch(function(erro){
        return res.status(400).json({
            erro: true,
            message: "Erro ao buscar a Compra."
        });
    });
});

// Editar Compra - Mudar: data
app.put('/compras/:id/editar', async(req, res)=>{
    if(!await compra.findByPk(req.params.id)){
        return res.status(400).json({
            erro: true,
            message: "Compra não encontrada."
        });
    };
    const reqcompra={
        data: req.body.data
    };
    await compra.update(reqcompra,{
        where: {id: req.params.id}
    }).then(function(){
        return res.json({
            erro: false,
            message: "Compra alterada com sucesso!"
        });
    }).catch(function(erro){
        return res.status(400).json({
            erro: true,
            message: "Erro ao alterar a Compra."
        });
    });
});

// Excluir Compra
app.get('/compras/:id/excluir', async(req, res)=>{
    if(!await compra.findByPk(req.params.id)){
        return res.status(400).json({
            erro: true,
            message: "Compra não encontrada."
        });
    };
    await compra.destroy({
        where: {id: req.params.id}
    }).then(function(){
        return res.json({
            erro: false,
            message: "Compra excluída com sucesso!"
        });
    }).catch(function(erro){
        return res.status(400).json({
            erro: true,
            message: "Erro ao excluir a Compra."
        });
    });
});

//////////////////////////////////////////////////////// PRODUTOS

// Cadastrar Produto
app.post('/produtos', async(req, res)=>{
    await produto.create(
        req.body
    ).then(function(){
        return res.json({
            erro: false,
            message: "Produto criado com sucesso!"
        })
    }).catch(function(erro){
        return res.status(400).json({
            erro: true,
            message: "Erro ao criar Produto!"
        })
    });
});

// Listar todos os Produtos
app.get('/produtos/lista', async(req, res)=>{
    await produto.findAll({
        //raw: true
        order: [['nome', 'ASC']]
    }).then(function(produtos){
        res.json({produtos})
    });
});

// Listar quantidade de Produtos
app.get('/produtos/quantidade', async(req, res)=>{
    await produto.count('id')
    .then(function(produto){
        res.json({
            erro: false,
            produto
        });
    }).catch(function(erro){
        return res.status(400).json({
            erro: true,
            message: "Erro ao exibir a quantidade de Produtos"
        });
    });
});

// Listar um único Produto
app.get('/produtos/:id', async(req, res)=>{
    if(!await produto.findByPk(req.params.id)){
        return res.status(400).json({
            erro: true,
            message: "Produto não encontrado."
        });
    };
    await produto.findByPk(req.params.id)
    .then(produtos=>{
        return res.json({
            erro: false,
            produtos
        });
    }).catch(function(erro){
        return res.status(400).json({
            erro: true,
            message: "Erro: não foi possível conectar."
        });
    });
});

// Listar as Compras com o Produto X
app.get('/produtos/:id/compras', async(req, res)=>{
    if(!await produto.findByPk(req.params.id)){
        return res.status(400).json({
            erro: true,
            message: "Produto não encontrado."
        });
    };
    await produto.findByPk(
        req.params.id,{include: [{all: true}]})
    .then(produtos=>{
        return res.json({
            erro: false,
            produtos
        });
    }).catch(function(erro){
        return res.status(400).json({
            erro: true,
            message: "Erro ao buscar o Produto."
        });
    });
});

// Editar Produto - Mudar: nome e/ou descrição
app.put('/produtos/:id/editar', async(req, res)=>{
    if(!await produto.findByPk(req.params.id)){
        return res.status(400).json({
            erro: true,
            message: "Serviço não encontrado."
        });
    };
    const produs ={
        nome: req.body.nome,
        descricao: req.body.descricao
    }
    await produto.update(produs,{
        where: {id: req.params.id}
    }).then(function(){
        return res.json({
            erro: false,
            message: "Produto alterado com sucesso!"
        });
    }).catch(function(erro){
        return res.status(400).json({
            erro: true,
            message: "Erro ao alterar o Produto."
        });
    });
});

// Excluir Produto
app.get('/produtos/:id/excluir', async(req, res)=>{
    if(!await produto.findByPk(req.params.id)){
        return res.status(400).json({
            erro: true,
            message: "Produto não encontrado."
        });
    };
    await produto.destroy({
        where: {id: req.params.id}
    }).then(function(){
        return res.json({
            erro: false,
            message: "Produto excluído com sucesso!"
        });
    }).catch(function(erro){
        return res.status(400).json({
            erro: true,
            message: "Erro ao excluir Produto."
        });
    });
});

//////////////////////////////////////////////////////// ITEM COMPRA

// Cadastrar ItemCompra
app.post('/itemcompra', async(req, res)=>{
    await itemcompra.create(
        req.body
    ).then(function(){
        return res.json({
            erro: false,
            message: "Item adicionado a Compra com sucesso!"
        })
    }).catch(function(erro){
        return res.status(400).json({
            erro: true,
            message: "Erro ao adicionar o item a Compra."
        })
    });
});

// Listar todos os ItemCompra
app.get('/itemcompra/lista', async(req, res)=>{
    await itemcompra.findAll({
        raw: true
    }).then(function(itens){
        res.json({itens})
    });
});

// Listar quantidade de ItemCompra
app.get('/itemcompra/quantidade', async(req, res)=>{
    await itemcompra.count('id')
    .then(function(itensc){
        res.json({
            erro: false,
            itensc
        });
    }).catch(function(erro){
        return res.status(400).json({
            erro: true,
            message: "Erro ao exibir a quantidade de Item Compra"
        });
    });
});

// Listar um único ItemCompra
app.get('/itemcompra/:id', async(req, res)=>{
    if(!await itemcompra.findByPk(req.params.id)){
        return res.status(400).json({
            erro: true,
            message: "Item Compra não encontrado."
        });
    };
    await itemcompra.findByPk(req.params.id)
    .then(itensc=>{
        return res.json({
            erro: false,
            itensc
        });
    }).catch(function(erro){
        return res.status(400).json({
            erro: true,
            message: "Erro: não foi possível conectar."
        });
    });
});

// Editar ItemCompra - Mudar: quantidade e/ou valor
app.put('/itemcompra/:id/editar', async(req, res)=>{
    const itemc={
        quantidade: req.body.quantidade,
        valor: req.body.valor
    };
    if (!await compra.findByPk(req.params.id)){
        return res.status(400).json({
            erro: true,
            message: "Compra não foi encontrada."
        });
    };
    if(!await produto.findByPk(req.body.ProdutoId)){
        return res.status(400).json({
            erro: true,
            message: 'Produto não foi encontrado'
        });
    };
    await itemcompra.update(itemc,{
        where: Sequelize.and({ProdutoId: req.body.ProdutoId},
            {CompraId: req.params.id})
    }).then(function(itensc){
        return res.json({
            erro: false,
            message: "Compra foi alterada com sucesso",
            itensc
        });
    }).catch(function(erro){
        return res.status(400).json({
            erro: true,
            message: "Erro: não foi possivel alterar."
        });
    });
});

// Excluir ItemCompra do Pedido X
app.get('/compras/:id/item/excluir', async(req, res)=>{
    if(!await compra.findByPk(req.params.id)){
        return res.status(400).json({
            erro: true,
            message: "Compra não encontrada."
        });
    };
    await itemcompra.destroy({        
        where: Sequelize.and({
            ProdutoId: req.body.ProdutoId, 
            CompraId: req.params.id
        })
    }).then(function(){
        return res.json({
            erro: false,
            message: "Item excluído com sucesso!"
        });
    }).catch(function(erro){
        return res.status(400).json({
            erro: true,
            message: "Erro ao excluir o item."
        });
    });
});

//////////////////////////////////////////////////////// PORTA SERVIDOR
let port = process.env.PORT || 3001;
app.listen(port,(req, res)=>{
    console.log('Servidor Ativo: http://localhost:3001');
});
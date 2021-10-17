window.onload = function(){

    // listar produtos
    const listarProdutos = function(listaProdutos, produtos){
        for (let item of listaProdutos){
            let li = document.createElement('li');
            produtos.appendChild(li).textContent = item.produto;
        }
    
    const produtosLi = document.querySelectorAll(`#produtos > li`); 
    let index = 0;  
    for(let produto of produtosLi){              
        produto.addEventListener('click', function(produto){            
            adicionarProduto(produto, listaProdutos);            
        })
        produto.setAttribute('id', index);
        index++;
    }
    }
    

    // lista de produtos
    const produtos = document.querySelector('#produtos'); 
    let listaProdutos = [
        {produto:'🍇 Uva', preco:1.00},
        {produto:'🍊 Laranja', preco:2.00},
        {produto:'🥭 Manga', preco:3.00},
        {produto:'🍈 Melão', preco:4.00},
        {produto:'🍐 Pera', preco:5.00},
        {produto:'🍎 Maça', preco:6.00},
    ]
    listarProdutos(listaProdutos, produtos); 


    // adc produtos na cesta
    let cestaProdutos = [];
    const adicionarProduto = function(produto, listaProdutos){
        let cestaDoCliente = document.querySelector('#cestaDoCliente');
        let li = document.createElement('li');     

        if(cestaProdutos.includes(produto.target.innerText, 0) === false){
            cestaDoCliente.appendChild(li).textContent = produto.target.innerText;
            cestaProdutos.push(produto.target.innerText);
            somarTotal(produto, listaProdutos);
            adicionaOuvidorParaRemoverProduto(cestaDoCliente.lastChild);
        } else{
            alert(`O item ${produto.target.innerText} já está em sua cesta de compras`);
        }
    }


    // somar produtos da cesta
    let total = 0;
    const somarTotal = function(produto, listaProdutos){
        let mostraTotalCompra = document.querySelector('#mostraTotalCompra');    
        total += listaProdutos[produto.target.id].preco;
        mostraTotalCompra.value = `${total.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}`;
    }


    function adicionaOuvidorParaRemoverProduto(liDaCestaDoCliente){
        liDaCestaDoCliente.addEventListener('click', function(liDaCestaDoCliente){          
            //Remove da Cesta
            liDaCestaDoCliente.target.remove(); 
            //Remove do Array
            let index = cestaProdutos.indexOf(liDaCestaDoCliente.target.innerText);
            cestaProdutos.splice(index, 1);
            //Diminui o valor do Somatório
            for (let item of listaProdutos){
                if(item.produto === liDaCestaDoCliente.target.innerText){
                    let mostraTotalCompra = document.querySelector('#mostraTotalCompra');  
                    total -= item.preco;
                    mostraTotalCompra.value = `${total.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}`;
                }
            }
        })
    }
}
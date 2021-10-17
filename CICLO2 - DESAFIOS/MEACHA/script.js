window.onload = function(){

    let dadosCep = async function(cep){

        let url = `https://viacep.com.br/ws/${cep}/json/`;
        try {
        let dadosFetch = await fetch(url);

        let dadosJson = await dadosFetch.json();
        resultadoCep(dadosJson);
        } catch(error){
            alert(error);
        }
    }

    function resultadoCep(infoCep){
        for (let campo in infoCep){
            if(document.querySelector(`#${campo}`)){
                document.querySelector(`#${campo}`).value= infoCep[campo];
            }
        }

    }

    const btnBuscar = document.querySelector("#buscarCep");
    const cxCep = document.querySelector("#cep");

    btnBuscar.addEventListener('click', function(){
        dadosCep(cxCep.value);
    });
    
}
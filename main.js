let isShort = 0;

function compute(event) {
  event.preventDefault();
  //Numberizing
  
  let entrada     = document.getElementById('entrada').value;
  let alvo        = document.getElementById('alvo-input').value;
  let nContratos  = document.getElementById('nContratos').value;
  let alavancagem = document.getElementById('alavancagem').value;
  let stop        = document.getElementById('stop-input').value;
  let parcial     = document.getElementById('partial-input').value;

  let meta  = document.getElementById('meta-input').value;
  let conta = document.getElementById('conta').value;


  entrada     = numberParse(entrada);
  alvo        = numberParse(alvo);
  alavancagem = numberParse(alavancagem);
  nContratos  = numberParse(nContratos);
  stop        = numberParse(stop);
  parcial     = numberParse(parcial);
  meta        = numberParse(meta);
  conta       = numberParse(conta);

  let marginGain    = String(calculaMargem(entrada,alvo,nContratos));
  let marginstop    = String(calculaMargem(entrada,stop,nContratos));
  let marginPartial = String(calculaMargem(entrada,parcial,nContratos));

  let marginInOperation = calculaMargemEmOperacao(nContratos,entrada,alavancagem);
  let gainPercentage    = calculaMargemPercentual(entrada,alvo,nContratos,meta,conta);
  let stopPercentage    = calculaMargemPercentual(entrada,stop,nContratos,meta,conta);
  let partialPercentage    = calculaMargemPercentual(entrada,parcial,nContratos,meta,conta);

  numberToHtml('margemOperacao','$'+ marginInOperation);

  numberToHtml('alvo-output',negativeSign(entrada,alvo,isShort) +'$'+ marginGain);
  numberToHtml('stop-output',negativeSign(entrada,stop,isShort) + '$'+ marginstop);
  numberToHtml('partial-output',negativeSign(entrada,parcial,isShort) +'$'+ marginPartial);
 
  numberToHtml('alvo-percentage',negativeSign(entrada,alvo,isShort) + gainPercentage + '%');
  numberToHtml('stop-percentage',negativeSign(entrada,stop,isShort) + stopPercentage + '%');
  numberToHtml('partial-percentage',negativeSign(entrada,parcial,isShort) + partialPercentage + '%');

  console.log( `
  entrada: ${entrada} \n
  Alvo: ${alvo}\n\n
  nContratos: ${nContratos}\n
  alavancagem: ${alavancagem}\n\n
  Entrada - Alvo:${(entrada-alvo).toFixed(5)}
  100k*Entrada - Alvo:${((entrada-alvo)*100000).toFixed(5)}
  abs de 100k*Entrada - Alvo:${Math.abs((entrada-alvo)*100000).toFixed(5)}

  meta: ${meta};
  conta:${conta};
  `);
}
function calculaMargem(entrada,alvo,nContratos){

let output = ((((Math.abs((alvo - entrada))))*(nContratos)*100000)).toFixed(2);

  return output;
}
function calculaMargemPercentual(entrada,alvo,nContratos,meta,conta){

  let output = calculaMargem(entrada,alvo,nContratos)/((meta/100)*conta);
  output = output.toFixed(2);
  output = String(output).replace(/,/g, '.')

  return output;
  }

function calculaMargemEmOperacao(nContratos,entrada,alavancagem){
  let output = (nContratos*entrada*100000/alavancagem).toFixed(2);
  return output.replace(/,/g, '.');
}
function numberParse(value){
    value = Number((value).replace(/,/g, '.'))
    return value;
  }

  function numberToHtml(id,value){
   return document.getElementById(id).innerText  = `${value}`;
  }

  function negativeSign(entrada,alvo,isShort){
    if (((entrada>alvo)&&!isShort)||(isShort&&(alvo>entrada))){
      return "-"}
      else return "";
  }




  function toggleButtonText(event) {
      const button = document.getElementById('toggleButton');

      if (isShort === 0) {
          button.innerHTML = 'Short';
          button.style.backgroundColor = '#d95353';
          isShort = 1;
          compute(event);
      } else {
          button.innerHTML = 'Long';
          button.style.backgroundColor = '#508c50'; // green
          isShort = 0;
          compute(event);
      }
  }


// EuroQuery:
$(document).ready(function() {
  $.ajax({
      url: 'https://api.frankfurter.app/latest?from=EUR&to=USD',
      dataType: 'json',
      success: function(data) {
          var rate = data.rates.USD;
          $('#exchangeRate').html(rate);
      },
      error: function() {
          $('#exchangeRate').html('Failed to get the exchange rate.');
      }
  });
});


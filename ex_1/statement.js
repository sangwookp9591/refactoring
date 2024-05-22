import invoices from './invoices.js';
import plays from './plays.js';
import createStatementData from './createStatementData.js';

/**
 *
 *
 * @param {*} invoice
 * @param {*} plays
 * @returns
 */
//이렇게하면 논리적으로 요소를 분리했지만
//텍스트 버전과 HTML버전 모두가 똑같은 계싼함수들을 사용하게 만들기 어렵다.

function statement(invoice, plays) {
    return renderPlainText(createStatementData(invoice, plays));
}

function renderPlainText(data) {
    // 중간 데이터 구조를 인수로 전달

    let result = `Statement for ${data.customer}\n`; //고객 데이터를 중간 데이터로부터 얻음

    for (let perf of data.performances) {
        // print line for this order 청구 내역 출력
        result += `  ${perf.play.name}: ${usd(perf.amount)} (${perf.audience} seats)\n`;
    }

    result += `Amount owed is ${usd(data.totalAmount)}\n`;
    result += `You earned ${data.totalVolumeCredits}점\n`;
    return result;
}

function htmlStatement(invoice, plays) {
    return renderHtml(createStatementData(invoice, plays));
}

function renderHtml(data) {
    let result = `<h1>청구 내역 (고객명 : ${data.customer}</h1>\n`;
    result += '<table/>\n';
    result += '<tr><th>연극</th><th>좌석 수</th><th>금액</th></tr>\n';
    for (let perf of data.performances) {
        result += `<tr><td>${perf.play.name}</td><td>${perf.audience}</td>`;
        result += `<td>${usd(perf.amount)}</td></tr>\n`;
    }
    result += `</table>\n`;
    result += `<p>청구 금액 : ${usd(data.totalAmount)}</p>\n`;
    result += `<p>보너스 점수 : ${data.totalVolumeCredits}</p>\n`;
    return result;
}

//usd 반환 Format 함수
function usd(aNumber) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).usd(
        aNumber / 100
    );
}
console.log('result : ', statement(invoices[0], plays));

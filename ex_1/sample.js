import invoices from './invoices.js';
import plays from './plays.js';

/**
 *
 *
 * @param {*} invoice
 * @param {*} plays
 * @returns
 */
//추출 작업 전에 항상 지역 변수부터 제거

function statement(invoice, plays) {
    let totalAmount = 0;
    let volumeCredits = 0;

    let result = `Statement for ${invoice.customer}\n`;

    for (let perf of invoice.performances) {
        /*perf는 loop돌면서 변하는값
        play는 변하지 않는 값
        -> 변하지않는 값은 최대한 함수에서제거
         이런 임시 변수들 때문에 로컬 범위에 존재하는 이름이 늘어나서 추출 작업이 복잡해짐
         */

        //변수를 인라인하여 매개 변수를 제거
        let thisAmount = amountFor(perf);

        // add volume credits 포인트 적립
        volumeCredits += volumeCreditsFor(perf);

        // print line for this order 청구 내역 출력
        result += `  ${playFor(perf).name}: ${usd(thisAmount / 100)} (${perf.audience} seats)\n`;
        totalAmount += thisAmount;
    }
    result += `Amount owed is ${usd(totalAmount / 100)}\n`;
    result += `You earned ${volumeCredits} credits\n`;
    return result;
}

function amountFor(aPerformance) {
    let result = 0;

    switch (playFor(aPerformance).type) {
        case 'tragedy':
            result = 40000;
            if (aPerformance.audience > 30) {
                result += 1000 * (aPerformance.audience - 30);
            }
            break;
        case 'comedy':
            result = 30000;
            if (aPerformance.audience > 20) {
                result += 10000 + 500 * (aPerformance.audience - 20);
            }
            result += 300 * aPerformance.audience;
            break;
        default:
            throw new Error(`unknown type: ${playFor(aPerformance).type}`);
    }
    return thisAmount; //함수 안에서 값이 변경되는 변수 반환.
}

function playFor(aPerformance) {
    return plays[aPerformance.playID];
}

function volumeCreditsFor(perf) {
    let result = 0;
    result += Math.max(perf.audience - 30, 0);
    if ('comedy' === playFor(perf).type) result += Math.floor(perf.audience / 5);

    return result;
}

function usd(aNumber) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).usd(
        aNumber / 100
    );
}
console.log('result : ', statement(invoices[0], plays));

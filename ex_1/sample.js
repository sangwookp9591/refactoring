import invoices from './invoices.js';
import plays from './plays.js';

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
    //단계 쪼개기
    //중간 데이터 구조를 인수로 전달
    const statementData = {};

    //이렇게 중간 데이터 구조를 인수로 전달하면
    //계산 관련 코드는 statement에 포함

    // data 매개 변수로 전달된 데이터만 처리하게 만들수 있다.

    //고객 데이터를 중간 데이터로 옮김.
    statementData.customer = invoice.customer;
    // 공연 데이터를 중간 데이터로 옮김.
    statementData.performances = invoice.performances.map(enrichPerformance);
    return renderPlainText(statementData, plays); // 중간 데이터 구조를 인수로 전달

    function enrichPerformance(aPerformance) {
        const result = Object.assign({}, aPerformance); //얕은 복사 수행
        //첫 레벨만 복사해서 가져옴.
        result.play = playFor(result);
        result.amount = amountFor(result);
        result.volumeCredits = volumeCreditsFor(result);
        return result;
    }

    //플레이어 추출함수.
    function playFor(aPerformance) {
        return plays[aPerformance.playID];
    }

    //volume creadits 구하는 함수
    function volumeCreditsFor(aPerformance) {
        let result = 0;
        result += Math.max(aPerformance.audience - 30, 0);
        if ('comedy' === aPerformance.play.type) result += Math.floor(perf.audience / 5);

        return result;
    }
    function amountFor(aPerformance) {
        let result = 0;

        switch (aPerformance.play.type) {
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
                throw new Error(`unknown type: ${aPerformance.play.type}`);
        }
        return result; //함수 안에서 값이 변경되는 변수 반환.
    }
}

function renderPlainText(data, plays) {
    // 중간 데이터 구조를 인수로 전달

    let result = `Statement for ${data.customer}\n`; //고객 데이터를 중간 데이터로부터 얻음

    for (let perf of data.performances) {
        // print line for this order 청구 내역 출력
        result += `  ${perf.play.name}: ${usd(perf.amount)} (${perf.audience} seats)\n`;
    }

    result += `Amount owed is ${usd(totalAmount() / 100)}\n`;
    result += `You earned ${totalVolumeCredits()} credits\n`;
    return result;

    function totalVolumeCredits() {
        let totalAmount = 0;
        for (let perf of data.performances) {
            totalAmount += perf.volumeCredits;
        }

        return totalAmount;
    }

    function totalAmount() {
        let totalAmount = 0;
        for (let perf of data.performances) {
            totalAmount += perf.amount;
        }
    }

    //usd 반환 Format 함수
    function usd(aNumber) {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).usd(
            aNumber / 100
        );
    }
}
console.log('result : ', statement(invoices[0], plays));

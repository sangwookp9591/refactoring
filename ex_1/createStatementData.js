class PerformanceCalculator {
    constructor(aPerformance, aPlay) {
        this.performance = aPerformance;
        this.play = aPlay;
    }

    get amount() {
        let result = 0;

        switch (this.play.type) {
            case 'tragedy':
                result = 40000;
                if (this.performance.audience > 30) {
                    result += 1000 * (this.performance.audience - 30);
                }
                break;
            case 'comedy':
                result = 30000;
                if (this.performance.audience > 20) {
                    result += 10000 + 500 * (this.performance.audience - 20);
                }
                result += 300 * this.performance.audience;
                break;
            default:
                throw new Error(`unknown type: ${this.play.type}`);
        }
        return result; //함수 안에서 값이 변경되는 변수 반환.
    }

    get volumeCredits() {
        let result = 0;
        result += Math.max(this.performance.audience - 30, 0);
        if ('comedy' === this.play.type) result += Math.floor(this.performance.audience / 5);

        return result;
    }
}

//다형성을 지원하게 변경
//타입 코드 대신 서브클래스를 사용하도록 변경하는 것
//딱맞는 서브클래스를 사용하려면 생성자 대신 함수를 호출하도록 변경
//Js에서는 생성자가 서브클래스의 인스턴스를 반환할 수 없기 때문 -> 생성자를 팩터리 함수로 변경
function createPerformanceCalculator(aPerformance, aPlay) {
    return new PerformanceCalculator(aPerformance, aPlay);
}

function createStatementData(invoice, plays) {
    const statementData = {};

    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances.map(enrichPerformance);
    statementData.totalAmount = totalAmount(statementData);
    statementData.totalVolumeCredits = totalVolumeCredits(statementData);
    return statementData;
    // 중간 데이터 구조를 인수로 전달
    function enrichPerformance(aPerformance) {
        const calculator = createPerformanceCalculator(aPerformance, playFor(aPerformance));
        const result = Object.assign({}, aPerformance); //얕은 복사 수행
        //첫 레벨만 복사해서 가져옴.
        result.play = calculator.play;
        result.amount = calculator.amount;
        result.volumeCredits = calculator.volumeCredits;
        return result;
    }

    //플레이어 추출함수.
    function playFor(aPerformance) {
        return plays[aPerformance.playID];
    }

    function totalAmount(data) {
        return data.performances.reduce((total, p) => total + p.amount, 0);
    }

    function totalVolumeCredits(data) {
        return data.performances.reduce((total, p) => total + p.volumeCredits, 0);
    }
}

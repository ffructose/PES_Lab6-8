import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-algorithm',
  templateUrl: './algorithm.component.html',
  styleUrls: ['./algorithm.component.css']
})
export class AlgorithmComponent implements OnChanges {
  @Input() facts: { name: string; description: string; value: boolean | number }[] = [];
  @Input() runAlgorithm: boolean = false; // Сигнал для запуску алгоритму
  log: string[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['runAlgorithm'] && this.runAlgorithm) {
      this.log = []; // Очищуємо попередні результати
      this.startAlgorithm(); // Запускаємо алгоритм
    }
  }

  startAlgorithm() {
    this.log.push('Встановимо робочу пам’ять у деякий стан:');
    this.log.push(this.getFactsState());

    const rules = [
      { id: 1, P: '¬f4∧¬f7', A: 'f1∧f5', action: 'ВідкритиВентильХолодноїВодиНа(f8)' },
      { id: 2, P: '¬f3∧¬f7', A: 'f2∧f6', action: 'ВідкритиВентильГарячоїВодиНа(f8)' },
      { id: 3, P: 'f3∧¬f7', A: 'f1∧f2∧f5', action: 'ЗакритиВентильГарячоїВоди()' },
      { id: 4, P: 'f4∧¬f7', A: 'f1∧f2∧f6', action: 'ЗакритиВентильХолодноїВоди()' }
    ];

    let ruleIndex = 0;
    let activeRuleFound = false;

    while (ruleIndex < rules.length) {
      const rule = rules[ruleIndex];
      this.log.push(`${ruleIndex + 1}. Продукція ${rule.id}.`);

      const P = this.evaluateExpression(rule.P);
      this.log.push(`Блок P: «${rule.P}» = ${P}`);

      if (P === 1) {
        this.log.push('Переходимо до ядра продукції (оскільки P=1) і намагаємося його активувати');
        const A = this.evaluateExpression(rule.A);
        this.log.push(`А: «${rule.A}» = ${A}`);

        if (A === 1) {
          this.log.push(`Викликається функція: ${rule.action}`);
          this.applyAction(rule.action);
          activeRuleFound = true;
          break; // Повертаємось до початку правил
        } else {
          this.log.push(`-> Ядро продукції ${rule.id} не буде активоване.`);
        }
      } else {
        this.log.push('Перехід до наступної продукції.');
      }

      ruleIndex++;
    }

    if (activeRuleFound) {
      this.log.push('Оскільки ядро продукції було активоване, алгоритм переходить на початок списку продукцій.');
      this.startAlgorithm(); // Рекурсивний виклик, починаємо заново
    } else {
      this.log.push('Експертна система опинилася у стані, коли більше немає активних правил для подальшого виконання.');
    }
  }

  getFactsState(): string {
    return this.facts.map(fact => `${fact.name}=${fact.value}`).join(', ');
  }

  evaluateExpression(expression: string): number {
    let modifiedExpression = expression
      .replace(/f(\d+)/g, (_, index) => (this.facts[+index - 1].value ? '1' : '0'))
      .replace(/¬/g, '!')
      .replace(/∧/g, '&&');
    return this.safeEvaluate(modifiedExpression) ? 1 : 0;
  }

  safeEvaluate(expression: string): boolean {
    try {
      const func = new Function(`return ${expression};`);
      return func();
    } catch (e) {
      console.error('Помилка обчислення виразу:', expression, e);
      return false;
    }
  }

  applyAction(action: string) {
    if (action.includes('ВідкритиВентильГарячоїВодиНа')) {
      this.facts[2].value = true; // f3 = true
    }
  }
}

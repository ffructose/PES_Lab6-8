import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-algorithm',
  templateUrl: './algorithm.component.html',
  styleUrls: ['./algorithm.component.css']
})
export class AlgorithmComponent implements OnChanges {
  @Input() facts: { name: string; description: string; value: boolean | number }[] = [];
  @Input() runAlgorithm: number = 0; // Лічильник запуску
  log: string[] = [];
  private stepCounter: number = 1; // Глобальний лічильник кроків

  ngOnChanges(changes: SimpleChanges) {
    if (changes['runAlgorithm'] && changes['runAlgorithm'].previousValue !== changes['runAlgorithm'].currentValue) {
      this.log = []; // Очищуємо попередні результати
      this.stepCounter = 1; // Скидаємо лічильник кроків
      this.startAlgorithm(); // Запускаємо алгоритм
    }
  }

  startAlgorithm() {
    try {
      this.addLog(`Встановимо робочу пам’ять у деякий стан:`, false);
      this.addLog(this.getFactsState(), false);

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
        this.addLog(`Продукція ${rule.id}.`);

        const P = this.evaluateExpression(rule.P);
        this.addLog(`Блок P: «${rule.P}» = ${P}`);

        if (P === 1) {
          this.addLog('Переходимо до ядра продукції (оскільки P=1) і намагаємося його активувати', false);
          const A = this.evaluateExpression(rule.A);
          this.addLog(`А: «${rule.A}» = ${A}`);

          if (A === 1) {
            this.addLog(`Викликається функція: ${rule.action}`);
            this.applyAction(rule.action);
            activeRuleFound = true;
            break; // Повертаємось до початку правил
          } else {
            this.addLog(`-> Ядро продукції ${rule.id} не буде активоване.`);
          }
        } else {
          this.addLog('Перехід до наступної продукції.');
        }

        ruleIndex++;
      }

      if (activeRuleFound) {
        this.addLog('Оскільки ядро продукції було активоване, алгоритм переходить на початок списку продукцій.');
        this.startAlgorithm(); // Рекурсивний виклик, починаємо заново
      } else {
        this.addLog('Експертна система опинилася у стані, коли більше немає активних правил для подальшого виконання.');
      }
    } catch (e: unknown) {
      if (e instanceof Error && e.message === 'Мета досягнута') {
        this.addLog('Алгоритм завершено. Вода тепла.', false);
      } else {
        console.error('Помилка виконання алгоритму:', e);
      }
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
    let changed = false;

    if (action.includes('ВідкритиВентильГарячоїВодиНа')) {
      const prevState = this.facts[2].value; // f3 (вентиль гарячої води повністю відкритий)
      this.facts[2].value = true; // Змінюємо стан факту f3
      this.facts[0].value = true; // f1 також стає true
      this.facts[7].value = Math.max(2, this.facts[7].value as number); // Оновлюємо крок для гарячої води
      this.addLog(
        `В цей момент змінюється факт f3: ${prevState ? 'true' : 'false'} → ${this.facts[2].value ? 'true' : 'false'}.`,
        false
      );
      changed = true;
    } else if (action.includes('ЗакритиВентильГарячоїВоди')) {
      const prevState = this.facts[2].value; // f3
      this.facts[2].value = false; // Змінюємо стан факту f3
      this.facts[7].value = Math.max(1, this.facts[7].value as number); // Оновлюємо крок для гарячої води
      this.addLog(
        `В цей момент змінюється факт f3: ${prevState ? 'true' : 'false'} → ${this.facts[2].value ? 'true' : 'false'}.`,
        false
      );
      changed = true;
    } else if (action.includes('ВідкритиВентильХолодноїВодиНа')) {
      const prevState = this.facts[3].value; // f4 (вентиль холодної води повністю відкритий)
      this.facts[3].value = true; // Змінюємо стан факту f4
      this.facts[1].value = true; // f2 також стає true
      this.facts[7].value = Math.max(1, this.facts[7].value as number); // Оновлюємо крок для холодної води
      this.addLog(
        `В цей момент змінюється факт f4: ${prevState ? 'true' : 'false'} → ${this.facts[3].value ? 'true' : 'false'}.`,
        false
      );
      changed = true;
    } else if (action.includes('ЗакритиВентильХолодноїВоди')) {
      const prevState = this.facts[3].value; // f4
      this.facts[3].value = false; // Змінюємо стан факту f4
      this.facts[7].value = Math.max(1, this.facts[7].value as number); // Оновлюємо крок для холодної води
      this.addLog(
        `В цей момент змінюється факт f4: ${prevState ? 'true' : 'false'} → ${this.facts[3].value ? 'true' : 'false'}.`,
        false
      );
      changed = true;
    }

    // Якщо стан вентилів змінився, перевіряємо температуру води
    if (changed) {
      this.updateWaterTemperature();
    }
  }

  updateWaterTemperature() {
    const hotSteps = Number(0);
    if (this.facts[0].value) {
      if (this.facts[2].value) {
        const hotSteps = 2;
      } else {
        const hotSteps = 1;
      }
    }
    const coldSteps = Number(0);
    if (this.facts[1].value) {
      if (this.facts[3].value) {
        const coldSteps = 2;
      } else {
        const coldSteps = 1;
      }
    }

    if (hotSteps  === coldSteps ) {
      // Вода стає теплою
      this.facts[4].value = false; // f5 (гаряча вода) = false
      this.facts[5].value = false; // f6 (холодна вода) = false
      this.facts[6].value = true; // f7 (тепла вода) = true
      this.addLog('Вода стає теплою. Система дійшла до мети.', false);
      throw new Error('Мета досягнута');
    } else if (hotSteps > coldSteps) {
      // Вода гаряча
      this.facts[4].value = true; // f5 (гаряча вода) = true
      this.facts[5].value = false; // f6 (холодна вода) = false
      this.facts[6].value = false; // f7 (тепла вода) = false
      this.addLog('Вода стає гарячою.', false);
    } else if (coldSteps > hotSteps) {
      // Вода холодна
      this.facts[4].value = false; // f5 (гаряча вода) = false
      this.facts[5].value = true; // f6 (холодна вода) = true
      this.facts[6].value = false; // f7 (тепла вода) = false
      this.addLog('Вода стає холодною.', false);
    } else {
      // Вода не змінюється
      this.facts[4].value = false; // f5 (гаряча вода) = false
      this.facts[5].value = false; // f6 (холодна вода) = false
      this.facts[6].value = false; // f7 (тепла вода) = false
      this.addLog('Вода не змінює свого стану.', false);
    }
  }

  addLog(message: string, numbered: boolean = true) {
    if (numbered) {
      this.log.push(`${this.stepCounter}. ${message}`);
      this.stepCounter++; // Збільшуємо лічильник кроків
    } else {
      this.log.push(message); // Додаємо ненумерований запис
    }
  }
}

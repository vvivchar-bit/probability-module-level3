document.addEventListener("DOMContentLoaded", function () {
    const taskContent = document.getElementById("taskContent");
    const buttons = document.querySelectorAll(".task-btn");

    function format(value, digits = 3) {
        return Number(value).toFixed(digits).replace(".", ",");
    }

    function erf(x) {
        const sign = x >= 0 ? 1 : -1;
        x = Math.abs(x);

        const a1 = 0.254829592;
        const a2 = -0.284496736;
        const a3 = 1.421413741;
        const a4 = -1.453152027;
        const a5 = 1.061405429;
        const p = 0.3275911;

        const t = 1 / (1 + p * x);
        const y =
            1 -
            (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) *
                t *
                Math.exp(-x * x));

        return sign * y;
    }

    function normalCdf(x) {
        return 0.5 * (1 + erf(x / Math.sqrt(2)));
    }

    const xValues17 = [0, 1, 2, 3];
    const pValues17 = [0.216, 0.432, 0.288, 0.064];

    const mean17 = xValues17.reduce((sum, x, i) => {
        return sum + x * pValues17[i];
    }, 0);

    const secondMoment17 = xValues17.reduce((sum, x, i) => {
        return sum + x * x * pValues17[i];
    }, 0);

    const variance17 = secondMoment17 - mean17 * mean17;
    const sigma17 = Math.sqrt(variance17);

    const sigma18 = 10;
    const p18a = 2 * normalCdf(10 / sigma18) - 1;
    const p18b = 2 * normalCdf(20 / sigma18) - 1;
    const p18c = 2 * normalCdf(30 / sigma18) - 1;

    const s19 = 0.7;
    const n19 = 20;
    const df19 = n19 - 1;
    const chi975 = 32.852;
    const chi025 = 8.907;
    const numerator19 = df19 * s19 * s19;
    const varianceMin19 = numerator19 / chi975;
    const varianceMax19 = numerator19 / chi025;
    const sigmaMin19 = Math.sqrt(varianceMin19);
    const sigmaMax19 = Math.sqrt(varianceMax19);

    const sample20 = [
        1, 3, 4, 5, 1,
        3, 4, 3, 5, 1,
        3, 4, 1, 3, 4,
        3, 4, 3, 4, 3
    ];

    const n20 = sample20.length;
    const variation20 = [...sample20].sort((a, b) => a - b);
    const values20 = [1, 3, 4, 5];

    const counts20 = values20.map(value => {
        return sample20.filter(item => item === value).length;
    });

    const relFreq20 = counts20.map(count => {
        return count / n20;
    });

    function polygonChart() {
        const points = [
            { x: 1, y: 0.20 },
            { x: 3, y: 0.40 },
            { x: 4, y: 0.30 },
            { x: 5, y: 0.10 }
        ];

        function scaleX(x) {
            return 110 + (x - 1) * 120;
        }

        function scaleY(y) {
            return 280 - (y / 0.45) * 220;
        }

        const gridValues = [0, 0.1, 0.2, 0.3, 0.4];

        const gridLines = gridValues.map(value => {
            const y = scaleY(value);
            return `
                <line class="grid-line" x1="70" y1="${y}" x2="700" y2="${y}"></line>
                <text class="label" x="34" y="${y + 5}">${value.toFixed(1)}</text>
            `;
        }).join("");

        const xLabels = [1, 3, 4, 5].map(value => {
            return `<text class="label" x="${scaleX(value) - 4}" y="310">${value}</text>`;
        }).join("");

        const polyline = points
            .map(point => `${scaleX(point.x)},${scaleY(point.y)}`)
            .join(" ");

        const pointElements = points
            .map(point => {
                return `
                    <circle class="chart-point" cx="${scaleX(point.x)}" cy="${scaleY(point.y)}" r="7"></circle>
                    <circle class="chart-point-inner" cx="${scaleX(point.x)}" cy="${scaleY(point.y)}" r="3"></circle>
                    <text class="label" x="${scaleX(point.x) - 18}" y="${scaleY(point.y) - 14}">
                        ${point.y.toFixed(2)}
                    </text>
                `;
            })
            .join("");

        return `
            <svg class="chart" viewBox="0 0 760 360">
                <text class="chart-title" x="255" y="28">Полігон відносних частот</text>

                ${gridLines}

                <line class="axis" x1="70" y1="280" x2="700" y2="280"></line>
                <line class="axis" x1="70" y1="50" x2="70" y2="280"></line>

                ${xLabels}

                <text class="axis-label" x="370" y="340">xᵢ</text>
                <text class="axis-label" x="18" y="48">wᵢ</text>

                <polyline class="chart-line" points="${polyline}"></polyline>

                ${pointElements}
            </svg>
        `;
    }

    function empiricalChart() {
        function scaleX(x) {
            return 110 + (x - 1) * 120;
        }

        function scaleY(y) {
            return 280 - y * 220;
        }

        const x1 = scaleX(1);
        const x3 = scaleX(3);
        const x4 = scaleX(4);
        const x5 = scaleX(5);

        const y0 = scaleY(0);
        const y02 = scaleY(0.2);
        const y06 = scaleY(0.6);
        const y09 = scaleY(0.9);
        const y1 = scaleY(1);

        const gridValues = [0, 0.2, 0.4, 0.6, 0.8, 1.0];

        const gridLines = gridValues.map(value => {
            const y = scaleY(value);
            return `
                <line class="grid-line" x1="70" y1="${y}" x2="700" y2="${y}"></line>
                <text class="label" x="34" y="${y + 5}">${value.toFixed(1)}</text>
            `;
        }).join("");

        const xLabels = [1, 3, 4, 5].map(value => {
            return `<text class="label" x="${scaleX(value) - 4}" y="310">${value}</text>`;
        }).join("");

        return `
            <svg class="chart" viewBox="0 0 760 360">
                <text class="chart-title" x="220" y="28">Графік емпіричної функції розподілу</text>

                ${gridLines}

                <line class="axis" x1="70" y1="280" x2="700" y2="280"></line>
                <line class="axis" x1="70" y1="50" x2="70" y2="280"></line>

                ${xLabels}

                <text class="axis-label" x="370" y="340">x</text>
                <text class="axis-label" x="18" y="48">F*(x)</text>

                <line class="step-helper" x1="${x1}" y1="280" x2="${x1}" y2="${y02}"></line>
                <line class="step-helper" x1="${x3}" y1="280" x2="${x3}" y2="${y06}"></line>
                <line class="step-helper" x1="${x4}" y1="280" x2="${x4}" y2="${y09}"></line>
                <line class="step-helper" x1="${x5}" y1="280" x2="${x5}" y2="${y1}"></line>

                <line class="step-line" x1="70" y1="${y0}" x2="${x1}" y2="${y0}"></line>
                <line class="step-line" x1="${x1}" y1="${y02}" x2="${x3}" y2="${y02}"></line>
                <line class="step-line" x1="${x3}" y1="${y06}" x2="${x4}" y2="${y06}"></line>
                <line class="step-line" x1="${x4}" y1="${y09}" x2="${x5}" y2="${y09}"></line>
                <line class="step-line" x1="${x5}" y1="${y1}" x2="700" y2="${y1}"></line>

                <circle class="chart-point-closed" cx="${x1}" cy="${y0}" r="6"></circle>
                <circle class="chart-point-open" cx="${x1}" cy="${y02}" r="6"></circle>

                <circle class="chart-point-closed" cx="${x3}" cy="${y02}" r="6"></circle>
                <circle class="chart-point-open" cx="${x3}" cy="${y06}" r="6"></circle>

                <circle class="chart-point-closed" cx="${x4}" cy="${y06}" r="6"></circle>
                <circle class="chart-point-open" cx="${x4}" cy="${y09}" r="6"></circle>

                <circle class="chart-point-closed" cx="${x5}" cy="${y09}" r="6"></circle>
                <circle class="chart-point-open" cx="${x5}" cy="${y1}" r="6"></circle>

                <text class="label" x="${x1 + 12}" y="${y02 - 8}">0.20</text>
                <text class="label" x="${x3 + 12}" y="${y06 - 8}">0.60</text>
                <text class="label" x="${x4 + 12}" y="${y09 - 8}">0.90</text>
                <text class="label" x="${x5 + 12}" y="${y1 - 8}">1.00</text>
            </svg>
        `;
    }

    const tasks = {
        17: `
            <h2>Завдання 17</h2>

            <div class="condition">
                <strong>Умова.</strong>
                Відомий закон розподілу випадкової величини X. Знайти її математичне
                сподівання, дисперсію та середнє квадратичне відхилення.
            </div>

            <table class="table">
                <tr>
                    <th>xᵢ</th>
                    <th>0</th>
                    <th>1</th>
                    <th>2</th>
                    <th>3</th>
                </tr>
                <tr>
                    <td>pᵢ</td>
                    <td>0,216</td>
                    <td>0,432</td>
                    <td>0,288</td>
                    <td>0,064</td>
                </tr>
            </table>

            <h3>Чому використовуємо ці формули</h3>
            <p>
                Випадкова величина задана законом розподілу, тому математичне
                сподівання та дисперсію знаходимо через суми за всіма значеннями xᵢ.
            </p>

            <h3>Розв’язання</h3>

            <p>Математичне сподівання:</p>
            <div class="formula">M(X) = Σxᵢpᵢ</div>

            <div class="formula">
                M(X) = 0·0,216 + 1·0,432 + 2·0,288 + 3·0,064
            </div>

            <div class="formula">M(X) = ${format(mean17, 2)}</div>

            <p>Знайдемо M(X²):</p>
            <div class="formula">M(X²) = Σxᵢ²pᵢ</div>

            <div class="formula">
                M(X²) = 0²·0,216 + 1²·0,432 + 2²·0,288 + 3²·0,064
            </div>

            <div class="formula">M(X²) = ${format(secondMoment17, 2)}</div>

            <p>Дисперсія:</p>
            <div class="formula">D(X) = M(X²) - [M(X)]²</div>

            <div class="formula">
                D(X) = ${format(secondMoment17, 2)} - (${format(mean17, 2)})²
            </div>

            <div class="formula">D(X) = ${format(variance17, 2)}</div>

            <p>Середнє квадратичне відхилення:</p>
            <div class="formula">σ = √D(X)</div>

            <div class="formula">σ = √${format(variance17, 2)} ≈ ${format(sigma17, 3)}</div>

            <div class="answer">
                Відповідь: M(X) = ${format(mean17, 2)}, D(X) = ${format(variance17, 2)},
                σ ≈ ${format(sigma17, 3)}.
            </div>
        `,

        18: `
            <h2>Завдання 18</h2>

            <div class="condition">
                <strong>Умова.</strong>
                Прилад працює без систематичних похибок, тобто M(X)=0.
                Похибка має нормальний розподіл, σ = 10 од.
                Знайти ймовірність того, що похибка не перевищує за абсолютною величиною:
                а) 10 од.; б) 20 од.; в) 30 од.
            </div>

            <h3>Чому використовуємо цю формулу</h3>
            <p>
                Похибка має нормальний розподіл і симетрична відносно нуля.
                Тому для ймовірності P(|X| ≤ a) використовуємо функцію стандартного
                нормального розподілу.
            </p>

            <h3>Розв’язання</h3>

            <div class="formula">M(X) = 0, σ = 10</div>

            <p>Основна формула:</p>
            <div class="formula">P(|X| ≤ a) = 2Φ(a / σ) - 1</div>

            <p>а) Для a = 10:</p>
            <div class="formula">z = 10 / 10 = 1</div>
            <div class="formula">P(|X| ≤ 10) = 2Φ(1) - 1 ≈ ${format(p18a, 4)}</div>

            <p>б) Для a = 20:</p>
            <div class="formula">z = 20 / 10 = 2</div>
            <div class="formula">P(|X| ≤ 20) = 2Φ(2) - 1 ≈ ${format(p18b, 4)}</div>

            <p>в) Для a = 30:</p>
            <div class="formula">z = 30 / 10 = 3</div>
            <div class="formula">P(|X| ≤ 30) = 2Φ(3) - 1 ≈ ${format(p18c, 4)}</div>

            <div class="answer">
                Відповідь: а) ${format(p18a, 4)}; б) ${format(p18b, 4)};
                в) ${format(p18c, 4)}.
            </div>
        `,

        19: `
            <h2>Завдання 19</h2>

            <div class="condition">
                <strong>Умова.</strong>
                Побудувати надійний інтервал для оцінки з надійністю 0,95
                невідомого середнього квадратичного відхилення нормально
                розподіленої генеральної сукупності X, якщо s = 0,7 і n = 20.
            </div>

            <h3>Чому використовуємо цю формулу</h3>
            <p>
                Потрібно оцінити невідоме середнє квадратичне відхилення σ нормально
                розподіленої генеральної сукупності. Для цього використовується
                χ²-розподіл із n − 1 ступенями вільності.
            </p>

            <h3>Розв’язання</h3>

            <div class="formula">s = 0,7, n = 20</div>
            <div class="formula">ν = n - 1 = 19</div>
            <div class="formula">γ = 0,95, α = 0,05</div>

            <p>Для нормально розподіленої генеральної сукупності використовуємо χ²-розподіл.</p>

            <div class="formula">
                (n - 1)s² / χ²₀,₉₇₅ &lt; σ² &lt; (n - 1)s² / χ²₀,₀₂₅
            </div>

            <p>Табличні значення χ² для ν = 19:</p>
            <div class="formula">χ²₀,₉₇₅ = ${chi975}</div>
            <div class="formula">χ²₀,₀₂₅ = ${chi025}</div>

            <p>Обчислюємо чисельник:</p>
            <div class="formula">(n - 1)s² = 19 · 0,7² = ${format(numerator19, 2)}</div>

            <p>Інтервал для дисперсії:</p>
            <div class="formula">
                ${format(numerator19, 2)} / ${chi975} &lt; σ² &lt; ${format(numerator19, 2)} / ${chi025}
            </div>

            <div class="formula">
                ${format(varianceMin19, 3)} &lt; σ² &lt; ${format(varianceMax19, 3)}
            </div>

            <p>Переходимо до середнього квадратичного відхилення:</p>
            <div class="formula">
                √${format(varianceMin19, 3)} &lt; σ &lt; √${format(varianceMax19, 3)}
            </div>

            <div class="formula">
                ${format(sigmaMin19, 3)} &lt; σ &lt; ${format(sigmaMax19, 3)}
            </div>

            <div class="answer">
                Відповідь: σ ∈ (${format(sigmaMin19, 3)}; ${format(sigmaMax19, 3)}).
            </div>
        `,

        20: `
            <h2>Завдання 20</h2>

            <div class="condition">
                <strong>Умова.</strong>
                Дано вибірку:
                1, 3, 4, 5, 1, 3, 4, 3, 5, 1, 3, 4, 1, 3, 4, 3, 4, 3, 4, 3.
                Потрібно побудувати варіаційний ряд, статистичний розподіл,
                полігон відносних частот та емпіричну функцію розподілу.
            </div>

            <h3>Розв’язання</h3>

            <p>Обсяг вибірки:</p>
            <div class="formula">n = ${n20}</div>

            <p>Варіаційний ряд:</p>
            <div class="formula">${variation20.join(", ")}</div>

            <p>Статистичний розподіл вибірки:</p>
            <table class="table">
                <tr>
                    <th>xᵢ</th>
                    <th>1</th>
                    <th>3</th>
                    <th>4</th>
                    <th>5</th>
                </tr>
                <tr>
                    <td>nᵢ</td>
                    <td>${counts20[0]}</td>
                    <td>${counts20[1]}</td>
                    <td>${counts20[2]}</td>
                    <td>${counts20[3]}</td>
                </tr>
                <tr>
                    <td>wᵢ</td>
                    <td>${format(relFreq20[0], 2)}</td>
                    <td>${format(relFreq20[1], 2)}</td>
                    <td>${format(relFreq20[2], 2)}</td>
                    <td>${format(relFreq20[3], 2)}</td>
                </tr>
            </table>

            <p>Перевірка суми відносних частот:</p>
            <div class="formula">0,20 + 0,40 + 0,30 + 0,10 = 1</div>

            <h3>Полігон відносних частот</h3>
            <p>Точки полігону:</p>
            <div class="formula">(1; 0,20), (3; 0,40), (4; 0,30), (5; 0,10)</div>

            <div class="visual-block">
                ${polygonChart()}
            </div>

            <h3>Емпірична функція розподілу</h3>

            <div class="formula">
                F*(x) = 0, якщо x ≤ 1
            </div>
            <div class="formula">
                F*(x) = 0,20, якщо 1 &lt; x ≤ 3
            </div>
            <div class="formula">
                F*(x) = 0,60, якщо 3 &lt; x ≤ 4
            </div>
            <div class="formula">
                F*(x) = 0,90, якщо 4 &lt; x ≤ 5
            </div>
            <div class="formula">
                F*(x) = 1, якщо x &gt; 5
            </div>

            <div class="visual-block">
                ${empiricalChart()}
            </div>

            <div class="answer">
                Відповідь: варіаційний ряд, статистичний розподіл, полігон
                відносних частот та емпіричну функцію розподілу побудовано.
            </div>
        `
    };

    function showTask(taskNumber) {
        taskContent.innerHTML = tasks[taskNumber];

        buttons.forEach(function (button) {
            if (button.dataset.task === String(taskNumber)) {
                button.classList.add("active");
            } else {
                button.classList.remove("active");
            }
        });
    }

    buttons.forEach(function (button) {
        button.addEventListener("click", function () {
            showTask(button.dataset.task);
        });
    });

    showTask(17);
});
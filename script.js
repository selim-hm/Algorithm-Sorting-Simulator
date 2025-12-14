document.addEventListener('DOMContentLoaded', function() {
    // عناصر DOM
    const arraySizeSlider = document.getElementById('arraySize');
    const arraySizeValue = document.getElementById('arraySizeValue');
    const speedSlider = document.getElementById('speed');
    const speedValue = document.getElementById('speedValue');
    const algorithmSelect = document.getElementById('algorithm');
    const generateArrayBtn = document.getElementById('generateArrayBtn');
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const resetBtn = document.getElementById('resetBtn');
    const comparisonsCountElement = document.getElementById('comparisonsCount');
    const swapsCountElement = document.getElementById('swapsCount');
    const statusElement = document.getElementById('status');
    const algorithmNameElement = document.getElementById('algorithmName');
    const barsContainer = document.getElementById('barsContainer');

    // متغيرات المحاكاة
    let array = [];
    let arraySize = parseInt(arraySizeSlider.value);
    let speed = parseInt(speedSlider.value);
    let algorithm = algorithmSelect.value;
    let isSorting = false;
    let isPaused = false;
    let animationDelay = 0;
    let currentAnimation = null;
    
    // الإحصائيات
    let comparisons = 0;
    let swaps = 0;
    
    // دوال المساعدة
    function updateArraySizeValue() {
        arraySizeValue.textContent = arraySizeSlider.value;
        arraySize = parseInt(arraySizeSlider.value);
    }
    
    function updateSpeedValue() {
        const speedValueMap = {
            1: 'بطيئة جداً',
            2: 'بطيئة',
            3: 'بطيئة',
            4: 'بطيئة',
            5: 'بطيئة متوسطة',
            6: 'بطيئة متوسطة',
            7: 'متوسطة',
            8: 'متوسطة',
            9: 'متوسطة',
            10: 'متوسطة',
            11: 'متوسطة سريعة',
            12: 'متوسطة سريعة',
            13: 'سريعة',
            14: 'سريعة',
            15: 'سريعة',
            16: 'سريعة',
            17: 'سريعة جداً',
            18: 'سريعة جداً',
            19: 'سريعة جداً',
            20: 'أقصى سرعة'
        };
        speedValue.textContent = speedValueMap[speedSlider.value];
        speed = parseInt(speedSlider.value);
        animationDelay = 1000 / speed;
    }
    
    function updateAlgorithmName() {
        const algorithmNames = {
            'bubble': 'فرز الفقاعة',
            'selection': 'فرز الاختيار',
            'insertion': 'فرز الإدراج'
        };
        algorithm = algorithmSelect.value;
        algorithmNameElement.textContent = algorithmNames[algorithm];
    }
    
    function generateRandomArray() {
        array = [];
        for (let i = 0; i < arraySize; i++) {
            array.push(Math.floor(Math.random() * 95) + 5);
        }
        renderBars();
        resetStats();
        enableControls();
    }
    
    function renderBars() {
        barsContainer.innerHTML = '';
        const maxValue = Math.max(...array);
        
        array.forEach((value, index) => {
            const bar = document.createElement('div');
            bar.className = 'bar';
            bar.id = `bar-${index}`;
            bar.style.height = `${(value / maxValue) * 100}%`;
            bar.textContent = value;
            bar.title = `القيمة: ${value}`;
            barsContainer.appendChild(bar);
        });
    }
    
    function resetStats() {
        comparisons = 0;
        swaps = 0;
        comparisonsCountElement.textContent = '0';
        swapsCountElement.textContent = '0';
        statusElement.textContent = 'جاهز';
        statusElement.style.color = '#4ade80';
    }
    
    function updateStats() {
        comparisonsCountElement.textContent = comparisons;
        swapsCountElement.textContent = swaps;
    }
    
    function updateStatus(status, color = '#4cc9f0') {
        statusElement.textContent = status;
        statusElement.style.color = color;
    }
    
    function enableControls() {
        startBtn.disabled = false;
        generateArrayBtn.disabled = false;
        arraySizeSlider.disabled = false;
        algorithmSelect.disabled = false;
        pauseBtn.disabled = true;
        pauseBtn.textContent = ' إيقاف مؤقت';
        pauseBtn.classList.remove('danger-btn');
        pauseBtn.classList.add('warning-btn');
    }
    
    function disableControls() {
        startBtn.disabled = true;
        generateArrayBtn.disabled = true;
        arraySizeSlider.disabled = true;
        algorithmSelect.disabled = true;
        pauseBtn.disabled = false;
    }
    
    // دوال التأثيرات البصرية
    function highlightBars(index1, index2, className = 'comparing') {
        const bar1 = document.getElementById(`bar-${index1}`);
        const bar2 = document.getElementById(`bar-${index2}`);
        
        if (bar1) bar1.classList.add(className);
        if (bar2) bar2.classList.add(className);
        
        return new Promise(resolve => {
            setTimeout(() => {
                if (bar1) bar1.classList.remove(className);
                if (bar2) bar2.classList.remove(className);
                resolve();
            }, animationDelay);
        });
    }
    
    function highlightBar(index, className = 'comparing') {
        const bar = document.getElementById(`bar-${index}`);
        if (bar) bar.classList.add(className);
        
        return new Promise(resolve => {
            setTimeout(() => {
                if (bar) bar.classList.remove(className);
                resolve();
            }, animationDelay);
        });
    }
    
    function markAsSorted(index) {
        const bar = document.getElementById(`bar-${index}`);
        if (bar) bar.classList.add('sorted');
    }
    
    function swapBars(index1, index2) {
        return new Promise(resolve => {
            const bar1 = document.getElementById(`bar-${index1}`);
            const bar2 = document.getElementById(`bar-${index2}`);
            
            if (bar1) bar1.classList.add('swapping');
            if (bar2) bar2.classList.add('swapping');
            
            // تبديل القيم في المصفوفة
            [array[index1], array[index2]] = [array[index2], array[index1]];
            
            // تحديث ارتفاع الأعمدة
            const maxValue = Math.max(...array);
            if (bar1) {
                bar1.style.height = `${(array[index1] / maxValue) * 100}%`;
                bar1.textContent = array[index1];
                bar1.title = `القيمة: ${array[index1]}`;
            }
            if (bar2) {
                bar2.style.height = `${(array[index2] / maxValue) * 100}%`;
                bar2.textContent = array[index2];
                bar2.title = `القيمة: ${array[index2]}`;
            }
            
            // زيادة عدد التبديلات
            swaps++;
            updateStats();
            
            setTimeout(() => {
                if (bar1) bar1.classList.remove('swapping');
                if (bar2) bar2.classList.remove('swapping');
                resolve();
            }, animationDelay);
        });
    }
    
    // خوارزميات الفرز
    async function bubbleSort() {
        let n = array.length;
        
        for (let i = 0; i < n - 1; i++) {
            if (isPaused) await waitForResume();
            if (!isSorting) return;
            
            for (let j = 0; j < n - i - 1; j++) {
                if (isPaused) await waitForResume();
                if (!isSorting) return;
                
                comparisons++;
                updateStats();
                updateStatus('يقارن العناصر', '#fbbf24');
                
                await highlightBars(j, j + 1);
                
                if (array[j] > array[j + 1]) {
                    updateStatus('يبدل العناصر', '#ef4444');
                    await swapBars(j, j + 1);
                }
            }
            
            markAsSorted(n - i - 1);
        }
        
        markAsSorted(0);
    }
    
    async function selectionSort() {
        let n = array.length;
        
        for (let i = 0; i < n - 1; i++) {
            if (isPaused) await waitForResume();
            if (!isSorting) return;
            
            let minIdx = i;
            
            // إبراز العنصر الحالي كعنصر محوري
            await highlightBar(i, 'pivot');
            
            for (let j = i + 1; j < n; j++) {
                if (isPaused) await waitForResume();
                if (!isSorting) return;
                
                comparisons++;
                updateStats();
                updateStatus('يبحث عن أصغر عنصر', '#fbbf24');
                
                await highlightBars(minIdx, j);
                
                if (array[j] < array[minIdx]) {
                    minIdx = j;
                }
            }
            
            if (minIdx !== i) {
                updateStatus('يبدل العناصر', '#ef4444');
                await swapBars(i, minIdx);
            }
            
            markAsSorted(i);
        }
        
        markAsSorted(n - 1);
    }
    
    async function insertionSort() {
        let n = array.length;
        
        for (let i = 1; i < n; i++) {
            if (isPaused) await waitForResume();
            if (!isSorting) return;
            
            let key = array[i];
            let j = i - 1;
            
            // إبراز العنصر الحالي
            await highlightBar(i, 'pivot');
            
            while (j >= 0 && array[j] > key) {
                if (isPaused) await waitForResume();
                if (!isSorting) return;
                
                comparisons++;
                updateStats();
                updateStatus('يقارن العناصر', '#fbbf24');
                
                await highlightBars(j, j + 1);
                
                // تحريك العنصر الأكبر لليمين
                updateStatus('يحول العناصر', '#8b5cf6');
                await swapBars(j, j + 1);
                
                j = j - 1;
            }
            
            array[j + 1] = key;
            
            // تحديث شريط العرض بعد الانتهاء
            const bar = document.getElementById(`bar-${j + 1}`);
            if (bar) {
                bar.textContent = key;
                bar.title = `القيمة: ${key}`;
            }
        }
        
        // وضع علامة على جميع العناصر كمرتبة
        for (let i = 0; i < n; i++) {
            markAsSorted(i);
        }
    }
    
    // دالة الانتظار حتى استئناف المحاكاة
    function waitForResume() {
        return new Promise(resolve => {
            const checkResume = () => {
                if (!isPaused) {
                    resolve();
                } else {
                    setTimeout(checkResume, 100);
                }
            };
            checkResume();
        });
    }
    
    // بدء المحاكاة
    async function startSorting() {
        if (isSorting) return;
        
        isSorting = true;
        isPaused = false;
        disableControls();
        resetStats();
        updateStatus('جاري الفرز...', '#4cc9f0');
        
        try {
            switch(algorithm) {
                case 'bubble':
                    await bubbleSort();
                    break;
                case 'selection':
                    await selectionSort();
                    break;
                case 'insertion':
                    await insertionSort();
                    break;
            }
            
            if (isSorting) {
                updateStatus('تم الفرز بنجاح!', '#4ade80');
                
                // إبراز جميع العناصر كمرتبة
                for (let i = 0; i < array.length; i++) {
                    markAsSorted(i);
                }
            }
        } catch (error) {
            console.error('حدث خطأ أثناء الفرز:', error);
            updateStatus('حدث خطأ', '#ef4444');
        } finally {
            isSorting = false;
            enableControls();
        }
    }
    
    // إيقاف المحاكاة مؤقتاً
    function pauseSorting() {
        if (!isSorting || isPaused) return;
        
        isPaused = true;
        pauseBtn.textContent = ' استئناف';
        pauseBtn.classList.remove('warning-btn');
        pauseBtn.classList.add('danger-btn');
        updateStatus('متوقف مؤقتاً', '#fbbf24');
    }
    
    // استئناف المحاكاة
    function resumeSorting() {
        if (!isSorting || !isPaused) return;
        
        isPaused = false;
        pauseBtn.textContent = 'إيقاف مؤقت';
        pauseBtn.classList.remove('danger-btn');
        pauseBtn.classList.add('warning-btn');
        updateStatus('جاري الفرز...', '#4cc9f0');
    }
    
    // إعادة التعيين
    function resetSorting() {
        isSorting = false;
        isPaused = false;
        generateRandomArray();
    }
    
    // إضافة مستمعي الأحداث
    arraySizeSlider.addEventListener('input', function() {
        updateArraySizeValue();
        if (!isSorting) {
            generateRandomArray();
        }
    });
    
    speedSlider.addEventListener('input', updateSpeedValue);
    algorithmSelect.addEventListener('change', updateAlgorithmName);
    
    generateArrayBtn.addEventListener('click', generateRandomArray);
    
    startBtn.addEventListener('click', function() {
        if (!isSorting) {
            startSorting();
        }
    });
    
    pauseBtn.addEventListener('click', function() {
        if (isSorting) {
            if (isPaused) {
                resumeSorting();
            } else {
                pauseSorting();
            }
        }
    });
    
    resetBtn.addEventListener('click', resetSorting);
    
    // تهيئة التطبيق
    updateArraySizeValue();
    updateSpeedValue();
    updateAlgorithmName();
    generateRandomArray();
    
    // تهيئة سرعة التحريك
    animationDelay = 1000 / speed;
});
document.addEventListener('DOMContentLoaded', function() {
    // =========================================
    // 내비게이션 부드러운 스크롤 및 페이지 이동 (이전과 동일하게 유지)
    // =========================================
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            const currentPath = window.location.pathname.split('/').pop();

            if (href.startsWith('#')) {
                e.preventDefault();

                const targetId = href;
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            } else if (href.includes('.html#') && currentPath !== href.split('#')[0].split('/').pop()) {
                // 다른 페이지의 특정 섹션으로 이동하는 경우 (예: works.html에서 index.html#about)
                // 브라우저의 기본 동작에 맡김 (preventDefault 호출 안 함)
            }
            // 그 외의 경우 (순수한 페이지 이동) 역시 preventDefault 호출 안 함
        });
    });

    // 스크롤 시 헤더 그림자 효과 (이전과 동일하게 유지)
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            } else {
                header.style.boxShadow = 'none';
            }
        });
    }

    // =========================================
    // ABOUT 섹션 이미지 스택 및 스크롤 기능 추가
    // =========================================
    const visualStackContainer = document.querySelector('.visual-stack-container');
    if (visualStackContainer) {
        const visuals = document.querySelectorAll('.about-visual');
        const currentSlideSpan = document.querySelector('.visual-pagination .current-slide');
        const totalSlidesSpan = document.querySelector('.visual-pagination .total-slides');

        let currentIndex = 0;
        const totalSlides = visuals.length;

        // 총 슬라이드 수 업데이트
        if (totalSlidesSpan) {
            totalSlidesSpan.textContent = totalSlides.toString().padStart(2, '0');
        }

        // 이미지 활성화 상태 업데이트
        function updateVisuals() {
            visuals.forEach((visual, index) => {
                if (index === currentIndex) {
                    visual.classList.add('active');
                    // z-index는 CSS에서 transition delay를 사용하여 처리
                } else {
                    visual.classList.remove('active');
                }
            });
            if (currentSlideSpan) {
                currentSlideSpan.textContent = (currentIndex + 1).toString().padStart(2, '0');
            }
        }

        // 스크롤 이벤트 처리
        let isScrolling = false; // 스크롤 중복 방지 플래그
        let scrollTimeout; // 스크롤 지연 타이머

        const handleScroll = (e) => {
            if (isScrolling) return;

            e.preventDefault(); // 기본 스크롤 동작 방지

            const direction = e.deltaY > 0 ? 1 : -1; // 아래 스크롤: 1, 위 스크롤: -1

            isScrolling = true;

            // 다음 또는 이전 이미지로 전환
            if (direction === 1) { // 아래 스크롤 (다음 이미지)
                currentIndex = (currentIndex + 1) % totalSlides;
            } else { // 위 스크롤 (이전 이미지)
                currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            }
            updateVisuals();

            // 스크롤 중복 방지 해제 (잠시 후)
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                isScrolling = false;
            }, 800); // 애니메이션 시간보다 길게 설정 (CSS transition 시간과 맞추기)
        };

        // 마우스 휠 이벤트 리스너 추가
        visualStackContainer.addEventListener('wheel', handleScroll, { passive: false });


        // 터치 스와이프 이벤트 (모바일)
        let startY;
        let endY;

        visualStackContainer.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
        }, { passive: false });

        visualStackContainer.addEventListener('touchmove', (e) => {
            e.preventDefault(); // 기본 스크롤 동작 방지 (iOS에서 특히 중요)
            endY = e.touches[0].clientY;
        }, { passive: false });

        visualStackContainer.addEventListener('touchend', () => {
            if (typeof startY === 'undefined' || typeof endY === 'undefined') return;

            const diffY = startY - endY; // 위로 스와이프: 양수, 아래로 스와이프: 음수

            if (Math.abs(diffY) > 50) { // 일정 거리 이상 스와이프했을 때만 동작
                if (diffY > 0) { // 위로 스와이프 (다음 이미지)
                    currentIndex = (currentIndex + 1) % totalSlides;
                } else { // 아래로 스와이프 (이전 이미지)
                    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
                }
                updateVisuals();
            }
            startY = undefined; // 값 초기화
            endY = undefined; // 값 초기화
        });

        // 페이지 로드 시 초기 이미지 설정
        updateVisuals();
    }
});
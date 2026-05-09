document.addEventListener('DOMContentLoaded', () => {
    // 1. 페이지 로드 시 body에 loaded 클래스 추가 (이때부터 reveal이 숨겨짐)
    document.body.classList.add('loaded');

    // 2. Intersection Observer 설정
    const observerOptions = {
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 섹션이 화면에 보이면 active 클래스 추가
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    // 3. 모든 reveal 요소 감시 시작
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));
});
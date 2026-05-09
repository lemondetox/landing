document.addEventListener('DOMContentLoaded', () => {
    const revealElements = document.querySelectorAll('.reveal');

    // 1. Intersection Observer가 브라우저에서 지원되지 않으면 애니메이션 없이 바로 노출
    if (!('IntersectionObserver' in window)) {
        revealElements.forEach(el => el.style.opacity = "1");
        return;
    }

    // 2. 감시 옵션 (화면에 10%만 보여도 작동 시작)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px' // 바닥에 닿기 전에 미리 실행되도록 살짝 여유를 줌
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 화면에 들어오면 active 클래스 추가
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // 3. 요소들 감시 시작 + body에 'loaded' 클래스는 모든 세팅이 끝난 뒤에 추가
    revealElements.forEach(el => observer.observe(el));
    
    // 약간의 시간차를 두어 브라우저가 준비될 시간을 줍니다.
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});
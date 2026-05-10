/**
 * 모바일 최적화 스크롤 애니메이션 스크립트
 * 90% 이상의 모바일 사용자를 위해 반응성을 높였습니다.
 */
document.addEventListener('DOMContentLoaded', () => {
    const revealElements = document.querySelectorAll('.reveal');

    // 1. 브라우저가 IntersectionObserver를 지원하지 않을 경우 (구형 기기 대비)
    if (!('IntersectionObserver' in window)) {
        revealElements.forEach(el => {
            el.classList.add('active'); // 애니메이션 없이 바로 노출
        });
        return;
    }

    // 2. 모바일 환경을 고려한 감시 옵션 설정
    const observerOptions = {
        // 요소가 10%만 보여도 즉시 실행 (모바일에서 답답함을 줄임)
        threshold: 0.1, 
        // 하단 여유 공간을 -10px로 줄여서 스크롤 시 더 빨리 나타나게 설정
        rootMargin: '0px 0px -10px 0px' 
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 화면에 들어오면 active 클래스 추가 (CSS 애니메이션 작동)
                entry.target.classList.add('active');
                
                // 성능 최적화: 한 번 나타난 요소는 더 이상 감시하지 않음 (배터리 절약)
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // 3. 모든 대상 요소 관찰 시작
    revealElements.forEach(el => observer.observe(el));
    
    // 4. 페이지 로드 완료 후 바디에 클래스 부여 (필요 시 활용)
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 50);
});
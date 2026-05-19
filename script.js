/**
 * 모바일 최적화 스크롤 애니메이션 스크립트
 */
document.addEventListener('DOMContentLoaded', () => {
    const revealElements = document.querySelectorAll('.reveal');

    if (!('IntersectionObserver' in window)) {
        revealElements.forEach(el => {
            el.classList.add('active');
        });
        return;
    }

    const observerOptions = {
        threshold: 0.1, 
        rootMargin: '0px 0px -10px 0px' 
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));
    
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 50);
});

/**
 * 폼 검증 및 브라우저 자연 전송 스크립트
 */
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const checkbox = document.getElementById('privacy-agree');
    const errorText = document.getElementById('privacy-error');
    const submitBtn = form.querySelector('.btn-submit'); 

    form.addEventListener('submit', function(event) {
        // 체크박스가 체크되어 있는지 확인
        if (!checkbox.checked) {
            event.preventDefault(); // 체크 안 됐을 때만 폼 전송을 막음
            errorText.style.display = 'block'; // 에러 메시지 표시
            checkbox.focus(); 
        } else {
            errorText.style.display = 'none'; 
            
            // 전송 시작 피드백
            alert('지원이 접수되었습니다. 확인을 누르면 전송이 완료됩니다.');
            
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerText = '전 송 중...';
            }
            // 브라우저 기본 기능으로 데이터를 formsubmit.io로 전송합니다.
        }
    });

    checkbox.addEventListener('change', function() {
        if (checkbox.checked) {
            errorText.style.display = 'none';
        }
    });
});
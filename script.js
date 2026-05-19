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

    // 3. 모든 대상 요소 관찰 시작
    revealElements.forEach(el => observer.observe(el));
    
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 50);
});

/**
 * [★수정됨] 폼 검증 및 브라우저 자연 전송 스크립트
 * 에러 창 없이 알림창만 띄우고 부드럽게 전송을 넘깁니다.
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
            
            // 정상 동의 후 전송 시 알림창을 띄우고 버튼을 '전송중'으로 고정
            alert('지원이 접수되었습니다. 확인을 누르면 전송이 완료됩니다.');
            
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerText = '전 송 중...';
            }
            // event.preventDefault()가 없으므로 브라우저 기본 기능으로 FormSubmit에 데이터를 전송합니다.
        }
    });

    checkbox.addEventListener('change', function() {
        if (checkbox.checked) {
            errorText.style.display = 'none';
        }
    });
});
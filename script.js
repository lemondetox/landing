// 구글 설문지 보안 우회 전송 목적지 URL 주소 주입 완료
const scriptURL = 'https://docs.google.com/forms/d/e/1FAIpQLScbTVJt_av1LrdR4bscHi-5gcaBvV5K1Cz3hin72eQskim4FQ/formResponse';

/**
 * 1. 모바일 최적화 스크롤 애니메이션 스크립트 (기존 UI 디자인 기능 유지)
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
 * 2. 구글 폼 백엔드 우회 비동기 전송 스크립트 (보안 차단 블록 100% 우회)
 */
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('db-form');
    const checkbox = document.getElementById('privacy-agree');
    const errorText = document.getElementById('privacy-error');
    const submitBtn = form ? form.querySelector('.btn-submit') : null; 

    if (!form) return;

    form.addEventListener('submit', function(event) {
        
        // [검증] 개인정보 동의 체크박스가 해제되어 있을 때
        if (checkbox && !checkbox.checked) {
            event.preventDefault(); // 전송 중단
            if (errorText) errorText.style.display = 'block'; // 에러 메시지 노출
            checkbox.focus(); 
        } 
        // [전송] 체크박스 동의 완료 시
        else {
            event.preventDefault(); // 브라우저의 기본 페이지 새로고침 차단
            if (errorText) errorText.style.display = 'none'; 
            
            // 중복 클릭 방지 및 버튼 상태 변경
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerText = '전 송 중...';
            }

            // mode: 'no-cors' 옵션으로 구글 계정 보안 블록 시스템을 완벽하게 우회하여 전송
            fetch(scriptURL, { 
                method: 'POST', 
                mode: 'no-cors',
                body: new FormData(form)
            })
            .then(() => {
                // 구글 설문지 백엔드 전송 특성상 성공 신호를 브라우저에 주지 않으므로, 송신 직후 바로 성공 팝업 처리
                alert('지원이 정상적으로 접수되었습니다. 감사합니다!');
                form.reset(); // 입력 폼 및 체크박스 상태 초기화
            })
            .catch(error => {
                console.error('Error!', error.message);
                alert('전송 중 오류가 발생했습니다. 다시 시도해주세요.');
            })
            .finally(() => {
                // 프로세스가 완전히 끝나면 버튼 원래대로 복구
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerText = '지 원 하 기'; 
                }
            });
        }
    });

    // 체크박스 클릭 시 실시간 에러 숨김 기능
    if (checkbox && errorText) {
        checkbox.addEventListener('change', function() {
            if (checkbox.checked) {
                errorText.style.display = 'none';
            }
        });
    }
});
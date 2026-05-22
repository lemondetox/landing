// 구글 설문지 보안 우회 전송 목적지 URL 주소
const scriptURL = 'https://docs.google.com/forms/d/e/1FAIpQLScbTVJt_av1LrdR4bscHi-5gcaBvV5K1Cz3hin72eQskim4FQ/formResponse';

/**
 * 1. 모바일 최적화 스크롤 애니메이션 스크립트 (UI 디자인 유지)
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
 * 2. 구글 폼 백엔드 우회 비동기 전송 및 완료 페이지 리다이렉트 스크립트
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
            event.preventDefault(); 
            if (errorText) errorText.style.display = 'block'; 
            checkbox.focus(); 
        } 
        // [전송] 체크박스 동의 완료 시
        else {
            event.preventDefault(); // 브라우저 새로고침 현상 차단
            if (errorText) errorText.style.display = 'none'; 
            
            // 중복 클릭 방지
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerText = '전 송 중...';
            }

            // 구글 폼으로 인코딩 데이터 전송
            fetch(scriptURL, { 
                method: 'POST', 
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams(new FormData(form)) 
            })
            .then(() => {
                // 데이터 전송이 시작되면 곧바로 완료 페이지(complete.html)로 즉시 이동합니다.
                window.location.href = 'complete.html'; 
            })
            .catch(error => {
                console.error('Error!', error.message);
                alert('전송 중 오류가 발생했습니다. 다시 시도해주세요.');
                
                // 에러 발생 시에만 버튼 잠금을 풀고 원래대로 복구합니다.
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerText = '지 원 하 기'; 
                }
            });
        }
    });

    // 실시간 에러 숨김 기능
    if (checkbox && errorText) {
        checkbox.addEventListener('change', function() {
            if (checkbox.checked) {
                errorText.style.display = 'none';
            }
        });
    }
});
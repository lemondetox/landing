// ⭐️ [필수 변경] 구글 앱스 스크립트 '새 배포' 후 받은 웹 앱 URL을 이 자리에 붙여넣으세요!
// 주의: 구글 시트 ID(106Kg4SS...)가 아니라 'https://script.google.com/macros/s/.../exec' 형태의 주소여야 합니다.
const scriptURL = '구글_앱스_스크립트_웹앱_URL을_여기에_넣으세요';

/**
 * 1. 모바일 최적화 스크롤 애니메이션 스크립트 (기존 기능 유지)
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
 * 2. 폼 검증 및 구글 시트 비동기 전송 스크립트 (통합 완성본)
 */
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const checkbox = document.getElementById('privacy-agree');
    const errorText = document.getElementById('privacy-error');
    const submitBtn = form ? form.querySelector('.btn-submit') : null; 

    // 페이지에 폼(Form)이 존재하지 않으면 스크립트 오류 방지를 위해 실행을 중단합니다.
    if (!form) return;

    form.addEventListener('submit', function(event) {
        
        // [검증] 개인정보 동의 체크박스가 있고, 체크가 안 되어 있을 때
        if (checkbox && !checkbox.checked) {
            event.preventDefault(); // 폼 전송을 막음
            if (errorText) errorText.style.display = 'block'; // 에러 메시지 표시
            checkbox.focus(); 
        } 
        // [전송] 체크박스가 정상적으로 체크되었을 때
        else {
            event.preventDefault(); // ⭐️ 중요: 브라우저가 기본적으로 페이지를 새로고침하며 전송하는 것을 완전히 차단
            if (errorText) errorText.style.display = 'none'; 
            
            // 전송 중 시각적 피드백 제공 및 중복 클릭 방지 (버튼 잠금)
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerText = '전 송 중...';
            }

            // Fetch API를 사용하여 구글 시트(앱스 스크립트)로 데이터를 비동기 전송
            fetch(scriptURL, { 
                method: 'POST', 
                body: new FormData(form)
            })
            .then(response => {
                // 구글 시트에 데이터 저장 성공 시
                alert('지원이 정상적으로 접수되었습니다. 감사합니다!');
                form.reset(); // 입력 창 및 체크박스 상태 초기화
            })
            .catch(error => {
                // 네트워크 오류 등 실패 시
                console.error('Error!', error.message);
                alert('전송 중 오류가 발생했습니다. 다시 시도해주세요.');
            })
            .finally(() => {
                // 성공하든 실패하든 전송 프로세스가 끝나면 버튼을 다시 활성화
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerText = '지원하기'; // 원래 버튼 텍스트로 복구
                }
            });
        }
    });

    // 사용자가 체크박스를 체크하는 순간 실시간으로 에러 메시지를 숨겨주는 기능
    if (checkbox && errorText) {
        checkbox.addEventListener('change', function() {
            if (checkbox.checked) {
                errorText.style.display = 'none';
            }
        });
    }
});

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

    revealElements.forEach(el => observer.observe(el));
    
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 50);
});

/**
 * 폼 검증 및 FormSubmit 공식 AJAX 규격 전송 스크립트
 */
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const checkbox = document.getElementById('privacy-agree');
    const errorText = document.getElementById('privacy-error');
    const submitBtn = form.querySelector('.btn-submit');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // 브라우저 기본 이동 차단

        // [검증] 체크박스 확인
        if (!checkbox.checked) {
            errorText.style.display = 'block';
            checkbox.focus();
            return;
        } 
        
        errorText.style.display = 'none'; 

        // 중복 클릭 방지 (버튼 잠금)
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerText = '전 송 중...';
        }

        // [중요] FormSubmit AJAX 전송을 위한 데이터 객체 변환
        const formData = new FormData(form);
        const dataObject = {};
        formData.forEach((value, key) => {
            dataObject[key] = value;
        });

        // [중요] FormSubmit 공식 AJAX 전송 주소로 자동 변경 
        // (https://formsubmit.co/adp@adplanters.com -> https://formsubmit.co/ajax/adp@adplanters.com)
        const ajaxUrl = form.action.replace('formsubmit.co/', 'formsubmit.co/ajax/');

        // FormSubmit 공식 규격에 맞춘 Fetch 요청
        fetch(ajaxUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(dataObject) // 데이터를 JSON 문자열로 변환
        })
        .then(response => {
            if (response.ok) {
                alert('지원이 정상적으로 완료되었습니다. 감사합니다!');
                form.reset(); // 성공 시 폼 초기화
            } else {
                alert('전송 오류가 발생했습니다. FormSubmit 설정 또는 메일 활성화 상태를 확인해 주세요.');
            }
        })
        .catch(error => {
            console.error('FormSubmit AJAX Error:', error);
            alert('전송에 실패했습니다. 코드가 로컬 환경(file://)에서 실행 중이거나 보안 정책에 의해 차단되었을 수 있습니다. 서버 환경에서 다시 테스트해 주세요.');
        })
        .finally(() => {
            // 전송 완료 후 버튼 원상복구
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerText = '지 원 하 기';
            }
        });
    });

    checkbox.addEventListener('change', function() {
        if (checkbox.checked) {
            errorText.style.display = 'none';
        }
    });
});

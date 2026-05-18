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

/**
 * 폼 검증 및 FormSubmit 비동기(AJAX) 전송 스크립트
 */
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const checkbox = document.getElementById('privacy-agree');
    const errorText = document.getElementById('privacy-error');
    const submitBtn = form.querySelector('.btn-submit'); // 지원하기 버튼 호출

    form.addEventListener('submit', function(event) {
        // 우선 브라우저의 기본 전송(페이지 이동)을 막습니다.
        event.preventDefault(); 

        // [기존 로직 유지] 체크박스가 체크되어 있는지 확인
        if (!checkbox.checked) {
            errorText.style.display = 'block'; // 에러 메시지 표시
            checkbox.focus(); // 사용자의 시선을 체크박스로 이동
            return; // 체크가 안 되었다면 여기서 실행을 중단합니다.
        } 
        
        // 체크가 잘 되었다면 에러 메시지를 숨기고 전송 단계로 진행
        errorText.style.display = 'none'; 

        // --- 여기서부터 FormSubmit을 부드럽게 연동하는 AJAX 로직입니다 ---
        
        // 중복 클릭 방지를 위해 버튼을 잠시 비활성화합니다.
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerText = '전 송 중...';
        }

        // 폼 내부의 모든 입력 데이터를 수집합니다.
        const formData = new FormData(form);

        // FormSubmit 서버로 데이터를 비동기 전송합니다.
        fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                // 전송 성공 시 알림창을 띄우고 입력창을 깨끗하게 비웁니다.
                alert('지원이 정상적으로 완료되었습니다. 감사합니다!');
                form.reset(); 
            } else {
                // FormSubmit 서버 오류 혹은 이메일 인증이 안 된 경우
                alert('전송 중 오류가 발생했습니다. 이메일 활성화 상태를 확인해 주세요.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('네트워크 오류가 발생했습니다. 인터넷 연결을 확인해 주세요.');
        })
        .finally(() => {
            // 전송 프로세스가 끝나면 버튼을 다시 원래대로 되돌립니다.
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerText = '지 원 하 기';
            }
        });
    });

    // [기존 로직 유지] 사용자가 경고를 보고 체크박스를 누르는 즉시 빨간 글씨가 사라지도록 만드는 편의 기능
    checkbox.addEventListener('change', function() {
        if (checkbox.checked) {
            errorText.style.display = 'none';
        }
    });
});

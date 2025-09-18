document.addEventListener('DOMContentLoaded', () => {
    const userPointsEl = document.getElementById('user-points');
    const userLevelEl = document.getElementById('user-level');
    const addPointsBtn = document.getElementById('add-points-btn');
    const redeemPointsBtn = document.getElementById('redeem-points-btn');
    const referralCodeEl = document.getElementById('referral-code');
    const copyReferralBtn = document.getElementById('copy-referral-btn');

    // Inicializar puntos y nivel
    let points = parseInt(localStorage.getItem('userPoints')) || 0;
    let level = localStorage.getItem('userLevel') || 'Madera';

    const updateUI = () => {
        userPointsEl.textContent = points;
        userLevelEl.textContent = level;
    };

    const updateLevel = () => {
        if (points >= 2000) {
            level = 'Platino';
        } else if (points >= 1000) {
            level = 'Diamante';
        } else if (points >= 500) {
            level = 'Oro';
        } else if (points >= 100) {
            level = 'Plata';
        } else {
            level = 'Madera';
        }
        localStorage.setItem('userLevel', level);
    };

    // Botón para simular una compra y ganar puntos
    if (addPointsBtn) {
        addPointsBtn.addEventListener('click', () => {
            points += 100;
            localStorage.setItem('userPoints', points);
            updateLevel();
            updateUI();
            alert('¡Has ganado 100 puntos LevelUp!');
        });
    }

    // Botón para canjear puntos
    if (redeemPointsBtn) {
        redeemPointsBtn.addEventListener('click', () => {
            const pointsToRedeem = 500;
            if (points >= pointsToRedeem) {
                points -= pointsToRedeem;
                localStorage.setItem('userPoints', points);
                updateLevel();
                updateUI();
                alert('¡Puntos canjeados! Se ha aplicado un cupón de descuento.');
            } else {
                alert('No tienes suficientes puntos para canjear.');
            }
        });
    }

    // Lógica para copiar el código de referido
    if (copyReferralBtn) {
        copyReferralBtn.addEventListener('click', () => {
            const referralCode = referralCodeEl.value;
            navigator.clipboard.writeText(referralCode).then(() => {
                alert('Código de referido copiado al portapapeles: ' + referralCode);
            }).catch(err => {
                console.error('Error al copiar el código:', err);
            });
        });
    }

    // Simulación de referido en la página de registro
    if (window.location.pathname.includes('registro.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const referrer = urlParams.get('ref');
        if (referrer) {
            alert(`¡Bienvenido! Has sido referido por el código: ${referrer}.`);
        }
    }

    updateLevel();
    updateUI();
});
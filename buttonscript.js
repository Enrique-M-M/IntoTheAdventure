document.addEventListener('DOMContentLoaded', function() {
    const button1 = document.getElementById('button1');
    const button2 = document.getElementById('button2');
    const button3 = document.getElementById('button3');
    const content = document.getElementById('content');

    button1.addEventListener('click', function() {
        toggleContent('Un grupo de cazarrecompensas llega a la ciudad de Valoria que está amenazada por el tirano Ythalian y pone una recompensa por acabar con el. Deberemos realizar misiones con nuestro grupo para equiparnos y acabar con Ythalian.');
    });

    button2.addEventListener('click', function() {
        toggleContent('Click izquierdo para selecccionar. Taberna para comprar equipo y mejorar personajes. Acceso a mazmorra para iniciar aventura.');
    });
    button3.addEventListener('click', function() {
        toggleContent('Desplegar tropas e iniciar turno. Los turnos se van intercambiando entre el jugador y los enemigos.');
    });

    function toggleContent(text) {
        if (content.innerHTML === '') {
            content.innerHTML = '<p>' + text + '</p>';
            main.style.height = main.offsetHeight + content.offsetHeight + 'px';
        } else {
            content.innerHTML = '';
            main.style.height = 'auto';
        }
    }
});
var self = this;//
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js', {
        scope: './'
    }).then(function (reg) {
        console.log(navigator.serviceWorker, navigator.serviceWorker.controller);
        if (!navigator.serviceWorker.controller) {
            return;
        }
        console.log("test");
        if (reg.waiting) {
            updateReady(reg.waiting);
            return;
        }
        console.log("test2");
        if (reg.installing) {
            trackInstalling(reg.installing);
            return;
        }
        console.log("test3");
        reg.addEventListener('updatefound', function () {
            trackInstalling(reg.installing);
        })
    }).catch(function (error) {
        log('Registration failed with ' + error);
    });
    navigator.serviceWorker.addEventListener('controllerchange', function () {
        window.location.reload();
    })
}

function log() {
  document.body.appendChild(document.createTextNode(Array.prototype.join.call(arguments, ", ") + '\n'));
    console.log.apply(console, arguments);
}

function updateReady(worker) {
    log("Update is ready to install!")
    var updateButton = document.createElement('button');
    updateButton.innerHTML = "Update ready!";
    updateButton.addEventListener('click', function () {
        worker.postMessage({
            action: 'skipWaiting'
        });
    });
    document.body.appendChild(updateButton);
}

function trackInstalling(worker) {
    log("tracking installation");
    worker.addEventListener('statechange', function () {
        log(worker.state);
        if (worker.state == 'installed') {
            updateReady(worker);
        }
    });
}
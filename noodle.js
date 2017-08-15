var noodle = {
    current: 0,
    total: 0,
    images: null,
    preloadedImages: [],
    lastKey: 0
};

function preload_single_image(imageUrl) {
    if (noodle.preloadedImages.indexOf(imageUrl) > -1) {
        return;
    }

    let image = new Image();
    image.src = imageUrl;
    noodle.preloadedImages.push(imageUrl);
}

function preload_images() {
    let next = (noodle.current + 1) % noodle.total;
    let prev = (noodle.current + noodle.total - 1) % noodle.total;

    preload_single_image(noodle.images[next].src);
    preload_single_image(noodle.images[prev].src);
}

function update_current_text() {
    document.getElementById('current_image').textContent = (noodle.current + 1).toString();
}

function next_image() {
    noodle.images[noodle.current].classList.add('hidden');
    noodle.current = (noodle.current + 1) % noodle.total;
    noodle.images[noodle.current].classList.remove('hidden');
    update_current_text();
    preload_images();
}

function previous_image() {
    noodle.images[noodle.current].classList.add('hidden');
    noodle.current = (noodle.current + noodle.total - 1) % noodle.total;
    noodle.images[noodle.current].classList.remove('hidden');
    update_current_text();
    preload_images();
}

function initialize_noodle() {
    noodle.images = document.querySelectorAll('#image_container > img');
    noodle.total = noodle.images.length;

    document.getElementById('total_images').textContent = noodle.total.toString();
    update_current_text();

    // add the 'hidden' class to all but the current (first) image
    for (let i = 0; i < noodle.images.length; i++) {
        let image = noodle.images[i];
        if (i !== noodle.current) {
            image.classList.add('hidden');
        }
    }

    // remove 'hidden' class from #image_container
    document.getElementById('image_container').classList.remove('hidden');

    // initial preload
    preload_images();

    // add event listeners to navigation buttons and arrow keys
    document.getElementById('next_button').addEventListener('click', next_image);
    document.getElementById('prev_button').addEventListener('click', previous_image);

    document.addEventListener('keydown', (event) => {
        if ((+ new Date()) - noodle.lastKey < 50) {
            return;
        }

        // right
        if (event.keyCode === 37) {
            noodle.lastKey = (+ new Date());
            previous_image();

        // left
        } else if (event.keyCode === 39) {
            noodle.lastKey = (+ new Date());
            next_image();
        }
    });
}

document.onreadystatechange = function() {
    if (document.readyState === 'interactive') {
        initialize_noodle();
    }
};

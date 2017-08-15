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

    preload_single_image(noodle.images[next]);
    preload_single_image(noodle.images[prev]);
}

function update_current_text() {
    document.getElementById('current_image').textContent = (noodle.current + 1).toString();
}

function update_image() {
    document.getElementById('image').classList.add('loading');
    document.getElementById('image').src = noodle.images[noodle.current];
    update_current_text();
}

function next_image() {
    noodle.current = (noodle.current + 1) % noodle.total;
    update_image();
}

function previous_image() {
    noodle.current = (noodle.current + noodle.total - 1) % noodle.total;
    update_image();
}

function initialize_noodle(imageUrls) {
    noodle.images = imageUrls;
    noodle.total = imageUrls.length;

    document.getElementById('total_images').textContent = noodle.total.toString();

    // "preload" first image, update image and set preload to onload event
    preload_single_image(noodle.images[noodle.current]);
    update_image();
    document.getElementById('image').onload = () => {
        document.getElementById('image').classList.remove('loading');
        preload_images();
    };

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

const getElement = (tagName, classNames, attributes) => {
	const element = document.createElement(tagName);
	if (classNames) {
		element.classList.add(...classNames)
	}
	if (attributes) {
		for (const attribute in attributes) {
			element[attribute] = attributes[attribute]
		}
	}
	return element;
}

const createHeader = ({
	title,
	header: {
		logo,
		menu,
		social
	}
}) => {
	const header = getElement('header');
	const container = getElement('div', ['container']);
	const wrapper = getElement('div', ['header']);

	if (logo) {
		const logoEl = getElement('img', ['logo'], {
			src: logo,
			alt: `Logo ${title}`,
		});
		wrapper.append(logoEl)
	}

	if (menu) {
		const nav = getElement('nav', ['menu-list']);
		const allMenuLink = menu.map(item => {
			const menuLink = getElement('a', ['menu-link'], {
				href: item.link,
				textContent: item.title
			});
			return menuLink;
		});
		nav.append(...allMenuLink);
		wrapper.append(nav);

		const menuBtn = getElement('button', ['menu-button']);
		menuBtn.addEventListener('click', () => {
			menuBtn.classList.toggle('menu-button-active');
			wrapper.classList.toggle('header-active');
		});
		container.append(menuBtn)
	}

	if (social) {
		const socialWrapper = getElement('div', ['social']);
		const allSocial = social.map(item => {
			const socialLink = getElement('a', ['social-link']);
			socialLink.append(getElement('img', [], {
				src: item.image,
				alt: item.title
			}));
			socialLink.href = item.link;
			return socialLink
		});

		socialWrapper.append(...allSocial);
		wrapper.append(socialWrapper)
	}

	header.append(container);
	container.append(wrapper);

	return header
};

const movieConstructor = (selector, options) => {
	const app = document.querySelector(selector);
	document.title = options.title;
	app.classList.add('body-app');

	app.style.color = options.fornVolor || '';
	app.style.backgroundColor = options.backgroundColor || '';

	if (options.subColor) {
		document.documentElement.style.setProperty('--sub-color', options.subColor);
	}

	if (options.favicon) {
		const index = options.favicon.lastIndexOf('.');
		const type = options.favicon.substring(index + 1);

		const favicon = getElement('link', null, {
			rel: 'icon',
			href: options.favicon,
			type: 'image/' + (type === 'svg' ? 'svg-xml' : type)
		});
		document.head.append(favicon)
	}

	app.style.backgroundImage = options.background ? `url(${options.background})` : '';

	if (options.header) {
		app.append(createHeader(options));
	}

	if (options.main) {
		app.append(createMain(options));
	}
	if (options.footer) {
		app.append(createFooter(options))
	}

};

const createMain = ({
	title,
	main: {
		genre,
		rating,
		description,
		trailer,
		slider
	}
}) => {
	const main = getElement('main');

	const container = getElement('div', ['container']);
	main.append(container);
	const wrapper = getElement('div', ['main-content']);
	container.append(wrapper);
	const content = getElement('div', ['content']);
	wrapper.append(content);

	if (genre) {
		const genreSpan = getElement('span', ['genre', 'animated', 'fadeInRight'], {
			textContent: genre
		});
		content.append(genreSpan);
	}

	if (rating) {
		const ratingBlock = getElement('div', ['rating', 'animated', 'fadeInRight']);
		const ratingStars = getElement('div', ['rating-stars']);
		const ratingNumber = getElement('div', ['rating-number'], {
			textContent: `${rating}/10`
		});
		for (let i = 0; i < 10; i++) {
			const star = getElement('img', ['star'], {
				alt: i ? '' : `Rating ${rating} from 10`,
				src: i < rating ? 'img/star.svg' : 'img/star-o.svg'
			});
			ratingStars.append(star)
		}

		ratingBlock.append(ratingStars, ratingNumber);
		content.append(ratingBlock);
	}

	content.append(getElement('h1', ['main-title', 'animated', 'fadeInRight'], {
		textContent: title
	}));

	if (description) {
		const descriptionElem = getElement('p', ['main-description', 'animated', 'fadeInRight'], {
			textContent: description
		});
		content.append(descriptionElem)
	}

	if (trailer) {
		const youtubeLink = getElement('a', ['button', 'animated', 'fadeInRight', 'youtube-modal'], {
			href: trailer,
			textContent: 'Watch trailer'
		});

		const youtubeImgLink = getElement('a', ['play', 'youtube-modal'], {
			href: trailer,
			ariaLabel: 'watch trailer'
		});
		const iconPlay = getElement('img', ['play-img'], {
			src: 'img/play.svg',
			alt: 'watch trailer',
			ariaHidden: true
		})


		content.append(youtubeLink);
		youtubeImgLink.append(iconPlay);
		wrapper.append(youtubeImgLink);
	}

	if (slider) {
		const sliderBlock = getElement('div', ['series']);
		const swiperBlock = getElement('div', ['swiper-container']);
		const swiperWrapper = getElement('div', ['swiper-wrapper']);
		const arrow = getElement('button', ['arrow']);

		const slides = slider.map((item) => {

			const swiperSlide = getElement('div', ['swiper-slide']);
			const card = getElement('figure', ['card']);
			const cardImage = getElement('img', ['card-img'], {
				src: item.img,
				alt: (item.title ? item.title + `` : '') + ' ' + (item.subtitle ? item.subtitle + `` : '')
			})
			card.append(cardImage);
			if (item.title || item.subtitle) {
				const cardDescription = getElement('figcaption', ['card-description']);
				cardDescription.innerHTML = `
				${item.subtitle ? `<p class="card-subtitle">${item.subtitle}</p>` : ''}
				${item.title ? `<p class="card-title">${item.title}</p>` : ''}
				`;
				card.append(cardDescription);
			}
			swiperSlide.append(card);
			return swiperSlide;
		});
		swiperWrapper.append(...slides);
		swiperBlock.append(swiperWrapper);
		sliderBlock.append(swiperBlock, arrow);
		container.append(sliderBlock);

		new Swiper(swiperBlock, {
			loop: true,
			navigation: {
				nextEl: arrow,
			},
			breakpoints: {
				320: {
					slidesPerView: 1,
					spaceBetween: 20
				},
				541: {
					slidesPerView: 2,
					spaceBetween: 40
				}
			}
		});

	}

	return main;
};

const createFooter = ({
	footer: {
		copyright,
		footerMenu
	}
}) => {
	const footer = getElement('footer', ['footer']);
	const container = getElement('div', ['container']);
	footer.append(container);
	const footerContent = getElement('div', ['footer-content']);
	container.append(footerContent);
	const left = getElement('div', ['left']);
	footerContent.append(left);
	const right = getElement('div', ['right']);
	footerContent.append(right);

	if (copyright) {
		const spanCopyright = getElement('span', ['copyright'], {
			textContent: copyright
		});
		left.append(spanCopyright);
	}

	if (footerMenu) {
		const nav = getElement('nav', ['footer-menu']);
		const allFooterMenuLinks = footerMenu.map(item => {
			const footerLink = getElement('a', ['footer-link'], {
				href: item.href,
				textContent: item.title
			});
			return footerLink;
		});
		nav.append(...allFooterMenuLinks);
		right.append(nav);
	}

	return footer;
};

movieConstructor('.app', {
	title: 'Witcher',
	background: 'witcher/background.jpg',
	favicon: 'witcher/logo.png',
	fontColor: '#ffffff',
	backgroundColor: '#141218',
	subColor: '#9D2929',
	header: {
		logo: 'witcher/logo.png',
		social: [{
				title: 'Twitter',
				link: 'https://twitter.com',
				image: 'witcher/social/twitter.svg'
			},
			{
				title: 'Instagramm',
				link: 'https://instagram.com',
				image: 'witcher/social/instagram.svg'
			},
			{
				title: 'Facebook',
				link: 'https://facebook.com',
				image: 'witcher/social/facebook.svg'
			}
		],
		menu: [{
			title: '????????????????',
			link: '#'
		}, {
			title: '??????????????',
			link: '#'
		}, {
			title: '????????????',
			link: '#'
		}]
	},
	main: {
		genre: '2019,??????????????',
		rating: '8',
		description: '?????????????? ??????????????, ???????????? ?? ???????????? ??????????????, ???? ?????????? ???????????? ???????????? ???? ???????????? ???????????? ???????????????????????? ???? ????????????????????. ???? ?????????? ?????????????? ???????????????? ?????????? ???????? ?????????????? ?????????????? ?????? ???? ???????????? ?????????????????? ????????????????? ???????? ???? ?????????? ???????????????? ?????????????????? ?? ???????? ?????????????????????????? ????????????????.',
		trailer: 'https://www.youtube.com/watch?v=P0oJqfLzZzQ',
		slider: [{
			img: 'witcher/series/series-1.jpg',
			title: '???????????? ??????????',
			subtitle: '?????????? ???1'
		}, {
			img: 'witcher/series/series-2.jpg',
			title: '???????????? ??????????',
			subtitle: '?????????? ???2'
		}, {
			img: 'witcher/series/series-3.jpg',
			title: '?????????????????????????? ????????',
			subtitle: '?????????? ???3'
		}, {
			img: 'witcher/series/series-4.jpg',
			title: '??????????????, ?????????????? ?? ????????????????',
			subtitle: '?????????? ???4'
		}]
	},
	footer: {
		copyright: '?? 2020 The Witcher. All right reserved.',
		footerMenu: [{
			title: 'Privacy Policy',
			href: '#'
		}, {
			title: 'Terms of Service',
			href: '#'
		}, {
			title: 'Legal',
			href: '#'
		}]
	}
});
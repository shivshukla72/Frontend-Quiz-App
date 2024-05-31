document.addEventListener('DOMContentLoaded',function() {
	themeToggle = document.getElementById('ud-qp__theme--toggle');
	themeToggle.addEventListener('click',(e)=> {
			if(!e.target.checked) {
					document.getElementsByTagName('body')[0].classList.remove('dark-theme--active');
			} else {
					document.getElementsByTagName('body')[0].classList.add('dark-theme--active');
			}
	});
	
	let courseData;

	function fetchQNA() {
		fetch('./data.json')
			.then((response)=> {
				if(!response.ok) {
					throw new Error(`Error Status Code: ${response.status}`)
				} else {
					return response.json();
				}
			})
			.then((data)=> {
				courseData = data;
			})
			.catch((err)=> {
				console.log('Data not found due to this error:', err);
			})		
	}

	courseData = fetchQNA();
	// Hightlight selected option
	let selectOption = (queOptions)=> {
		let optionContainer = document.querySelector('.ud-qp__que-option-container');

		queOptions.forEach((item)=> {
			item.addEventListener('click',(e)=> {
				if(optionContainer.querySelector('.error-msg')) {
					document.querySelector('.error-msg').remove();
				}
				queOptions.forEach((item)=> {
					item.classList.remove('selected');
					item.querySelector('.ud-qp__que-option').classList.remove('option--locked');
				})
				let currentOption = e.currentTarget;
				if(!currentOption.classList.contains('selected')) {
					currentOption.classList.add('selected')
					currentOption.querySelector('.ud-qp__que-option').classList.add('option--locked');
				} else {
					currentOption.classList.remove('selected');
					currentOption.querySelector('.ud-qp__que-option').classList.remove('option--locked');
				}
			})
		})
	}

	// Define Function to render first question of course
	let nextBtn;
	let courseContainer = document.querySelector('.ud-qp__container');
	let renderFirstQue = (courseQue,courseQueOptions)=> {
		document.querySelector('.ud-qp__course-name').innerText = courseName;
		let optionsHtml = "";
		courseQueOptions[0].forEach((option, index)=> {
			let letter = String.fromCharCode(65 + index);
			optionsHtml += `<div class='ud-qp__course-que-option-wrap cursor-pointer p-3 rounded-xl flex flex-wrap items-center gap-3 shadow-md mb-5' data-course='option-${index}'>
			<div class='ud-qp__course-icon flex-[0_0_64px] size-16 overflow-hidden bg-white text-center inline-block rounded-lg'>
				<span class='inline-block text-xl p-4 !text-black'>
				${letter}
				</span>
			</div>
			<div class='flex-[0_0_calc(100%_-_80px)]'>
				<span class='ud-qp__que-option block text-2xl'></span>
			</div>
			</div>`;
		})

		

		let firstQue = `<div class='ud-qp__test-panel'>
			<div class='ud-qp__test-panel-wrap flex flex-wrap gap-5'>
					<div class='flex-[0_0_100%] md:flex-[0_0_calc(60%_-_10px)]'>
							<span class='italic block mb-5 text-base'>
									Question 1 of ${courseQue.length}
							</span>
							<h2 class='text-2xl font-semibold max-w-[500px] mb-11'>${courseQue[0]}</h2>
					</div>
					<div class='ud-qp__que-option-container flex-[0_0_100%] md:flex-[0_0_calc(40%_-_10px)]'>
						${optionsHtml}
							<div class='mt-8'>
									<button class='ud-qp__course-next-btn block text-xl font-semibold p-4 rounded-xl text-center text-white bg-[#AC6FF6] w-full'>Next</button>
							</div>
					</div>
			</div>
		</div>`

		courseContainer.insertAdjacentHTML('beforeend',firstQue);

		// Add options here avoid the tag conflict, if tag comes on the option.
		courseQueOptions[queIndex].forEach((option, index) => {
			let optionElement = document.querySelector(`[data-course='option-${index}'] .ud-qp__que-option`);
			optionElement.textContent = option;
		});
		// Hightlight selected option
		let queOptions = document.querySelectorAll('.ud-qp__course-que-option-wrap');
		selectOption(queOptions);

		nextBtn = document.querySelector('.ud-qp__course-next-btn');
		checkScoreAndUpdateQue(nextBtn,courseAns);
	}

	let renderNextQue = (courseQue,courseQueOptions,queIndex)=> {
		let optionsHtml = "";
		courseQueOptions[queIndex].forEach((option, index)=> {
			let letter = String.fromCharCode(65 + index);
			optionsHtml += `<div class='ud-qp__course-que-option-wrap cursor-pointer p-3 rounded-xl flex flex-wrap items-center gap-3 shadow-md mb-5' data-course='option-${index}'>
			<div class='ud-qp__course-icon flex-[0_0_64px] size-16 overflow-hidden bg-white text-center inline-block rounded-lg'>
				<span class='inline-block text-xl p-4 !text-black'>
					${letter}
				</span>
			</div>
			<div class='flex-[0_0_calc(100%_-_80px)]'>
				<span class='ud-qp__que-option block text-2xl'></span>
			</div>
			</div>`;
		})
		let nextQue = `<div class='ud-qp__test-panel-wrap flex flex-wrap gap-5'>
					<div class='flex-[0_0_100%] md:flex-[0_0_calc(60%_-_10px)]'>
							<span class='italic block mb-5 text-base'>
									Question ${queIndex + 1} of ${courseQue.length}
							</span>
							<h2 class='text-2xl font-semibold max-w-[500px] mb-11'>${courseQue[queIndex]}</h2>
							
					</div>
					<div class='ud-qp__que-option-container flex-[0_0_100%] md:flex-[0_0_calc(40%_-_10px)]'>
						${optionsHtml}
							<div class='mt-8'>
									<button class='ud-qp__course-next-btn block text-xl font-semibold p-4 rounded-xl text-center text-white bg-[#AC6FF6] w-full'>Next</button>
							</div>
					</div>
			</div>`

		document.querySelector('.ud-qp__test-panel-wrap').remove();
		courseContainer.insertAdjacentHTML('beforeend',nextQue);
		// Add options here avoid the tag conflict, if tag comes on the option.
		courseQueOptions[queIndex].forEach((option, index) => {
			let optionElement = document.querySelector(`[data-course='option-${index}'] .ud-qp__que-option`);
			optionElement.textContent = option;
		});
		// Hightlight selected option
		let queOptions = document.querySelectorAll('.ud-qp__course-que-option-wrap');
		selectOption(queOptions);

		nextBtn = document.querySelector('.ud-qp__course-next-btn');
		checkScoreAndUpdateQue(nextBtn,courseAns);
	}
	

	// Define array to collect the from the json file and some global variable;
	let courseQue = [];
	let courseQueOptions = [];
	let courseAns = [];
	let queIndex = 0;
	let score = 0;
	let queLength;
	let courseName;
	let course = document.querySelectorAll('.ud-qp__course-wrap');
	course.forEach((item)=> {
		item.addEventListener('click',(e)=> {
			document.querySelector('.ud-qp__row').remove();
			courseName = e.currentTarget.dataset.course;
			for(let i in courseData) {
				if(courseData[i].courseName == courseName) {
					for(let j in courseData[i].QNA) {
						courseQue.push(courseData[i].QNA[j].question);
						courseAns.push(courseData[i].QNA[j].answer);
						courseQueOptions.push(courseData[i].QNA[j].options);
					}
				}
			}
			queLength = courseQue.length;
			// Call a first question render function after select the course by user.
			renderFirstQue(courseQue,courseQueOptions,courseName);
		});
	})

	let showResult = (score,courseName)=> {
		let resultHTML = `<div class="ud-qp__result text-center max-w-[550px] mx-auto">
		<h1 class="ud-qp__result-title text-5xl py-10 mb-3">${ score > 5 ? 'Congrats! you have passed the Test' : 'Sorry! you have not passed the Test' }</h1>
			<span class="text-lg">You have scored ${score} in ${courseName}.</span>
		</div>`
		document.querySelector('.ud-qp__test-panel-wrap').remove();
		courseContainer.insertAdjacentHTML('beforeEnd',resultHTML);
	}

	let checkScoreAndUpdateQue = (nextBtn,ansArr)=> {

		nextBtn.addEventListener('click',(e)=> {
			let optionContainer = document.querySelector('.ud-qp__que-option-container');
			let optionSelected = optionContainer.querySelector('.option--locked');
			if(optionSelected) {
				let optionSelectedText = optionSelected.innerText;
				if(optionSelectedText == ansArr[queIndex]) {
					score +=1;
				}
				++queIndex;
				if(queIndex < queLength) {
					renderNextQue(courseQue,courseQueOptions,queIndex);
				} else {
					showResult(score,courseName);
				}
			} else {
				let errMsg = document.querySelector('.error-msg');
				if(!errMsg) {
					let errElement = document.createElement('span');
					errElement.classList = "error-msg block !text-[#ff0000] text-sm mt-4";
					errElement.innerText = 'Kindly select any option to move forward !';
					optionContainer.append(errElement);
				}
			}
		})
	}
})
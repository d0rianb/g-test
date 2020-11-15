Array.prototype.shuffle = function() {
    for (let i = this.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this[i], this[j]] = [this[j], this[i]]
    }
    return this
}

function clamp(num, min, max) {
    return num <= min ? min : num >= max ? max : num
}

const NB_QUESTIONS = 10

let app = new Vue({
    el: "#app",
    data: {
        question: 'Lorem ipsum dolor sit amet, consectetur adipisicing',
        ressources: [],
        answers: [],
        indexList: [],
        currentIndex: 0,
        score: 0,
        scoreMultiplier: NB_QUESTIONS
    },
    filters: {
        formatFloat(number) {
            return new Intl.NumberFormat('fr-FR', { maximumSignificantDigits: 2 }).format(number)
        }
    },
    computed: {
        finished() {
            return !(this.currentIndex < NB_QUESTIONS - 1)
        }
    },
    mounted() {
        this.getRessources().then(() => {
            this.indexList = [...Array(this.ressources.length).keys()]
                .shuffle()
                .slice(0, NB_QUESTIONS)
            this.nextQuestion()
        })
    },
    methods: {
        async getRessources() {
            return await fetch('./static/ressources.json')
                .then(res => res.json())
                .then(json => this.$set(this.$data, 'ressources', json.ressources))
                .catch(err => console.error(err))
        },
        calcScore(e) {
            const amount = parseFloat(e.target.dataset.amount)
            this.score += amount * this.scoreMultiplier
            if (amount > 0) {
                this.scoreMultiplier += 1
            } else if (amount < 0) {
                this.scoreMultiplier -= 1
            }
            this.scoreMultiplier = clamp(this.scoreMultiplier, NB_QUESTIONS - 3, NB_QUESTIONS + 4)

            this.nextQuestion()
        },
        nextQuestion() {
            const questionIndex = this.indexList[this.currentIndex]
            this.question = this.ressources[questionIndex].question
            this.answers = this.ressources[questionIndex].answers
            this.currentIndex++
        }
    }

})
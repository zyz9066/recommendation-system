// users feedback on the movies
const usersFeedback = {
  'Mary': {
    'The Hobbit': 2.5,
    'The Lord of the Rings': 3.5,
    'Star Trek': 3.0,
    'The Terminator': 3.5,
    'Norbit': 2.5,
    'Star Wars': 3.0,
  },
  'Peter': {
    'The Hobbit': 3.0,
    'The Lord of the Rings': 3.5,
    'Star Trek': 1.5,
    'The Terminator': 5.0,
    'Norbit': 3.0,
    'Star Wars': 3.5,
  },
  'Stuart': {
    'The Hobbit': 2.5,
    'The Lord of the Rings': 3.0,
    'The Terminator': 3.5,
    'Star Wars': 4.0,
  },
  'Jessica': {
    'The Lord of the Rings': 3.5,
    'Star Trek': 3.0,
    'The Terminator': 4.0,
    'Norbit': 2.5,
    'Star Wars': 4.5,
  },
  'Paul': {
    'The Hobbit': 3.0,
    'The Lord of the Rings': 4.0,
    'Star Trek': 2.0,
    'The Terminator': 3.0,
    'Norbit': 2.0,
    'Star Wars': 3.0,
  },
  'Suzane': {
    'The Hobbit': 3.0,
    'The Lord of the Rings': 4.0,
    'The Terminator': 5.0,
    'Norbit': 3.5,
    'Star Wars': 3.0,
  },
  'Fred': {
    'The Lord of the Rings': 4.5,
    'The Terminator': 4.0,
    'Norbit': 1.0,
  }
};


/* Search for similar users */

// Euclidian distance
const euclidianDistance = (dataset, user1, user2) => {
  let distances = [];
  Object.entries(dataset[user1]).forEach(([item, score]) => {
    if (item in dataset[user2]) {
      distances.push(Math.pow(score - dataset[user2][item], 2));
    }
  })

  if (distances.length === 0) {
    return 0;
  }

  let euclidianSum = distances.reduce((accumulator, score) => accumulator + score, 0);

  return 1 / (1 + Math.sqrt(euclidianSum));
};

console.log(euclidianDistance(usersFeedback, 'Mary', 'Fred'))
console.log(euclidianDistance(usersFeedback, 'Mary', 'Jessica'))
console.log(euclidianDistance(usersFeedback, 'Mary', 'Peter'))

// Similarity between users
const getSimilarities = (dataset, user) => {
  let similarity = {};
  Object.keys(dataset).forEach((other) => {
    if (other !== user) {
      similarity[other] = euclidianDistance(dataset, user, other);
    }
  });

  let entries = Object.entries(similarity);
  entries.sort((a, b) => b[1] - a[1]);
  similarity = Object.fromEntries(entries);

  return similarity
};

console.log(getSimilarities(usersFeedback, 'Mary'))
console.log(getSimilarities(usersFeedback, 'Fred'))

/* Collaborative filtering - user-based filtering */

// Recommendations
const getUserRecommendation = (dataset, user) => {
  let totals = {}, similaritySum = {};
  Object.keys(dataset).forEach((other) => {
    if (other !== user) {
      let similarity = euclidianDistance(dataset, user, other);
      if (similarity !== 0) {
        Object.entries(dataset[other]).forEach(([item, score]) => {
          if (!(item in dataset[user])) {
            totals[item] = (totals[item] || 0) + score * similarity;
            similaritySum[item] = (similaritySum[item] || 0) + similarity;
          }
        });
      }
    }
  });

  let recommendations = {};
  Object.entries(totals).forEach(([item, total]) => {
    recommendations[item] = total / similaritySum[item];
  });

  let entries = Object.entries(recommendations);
  entries.sort((a, b) => b[1] - a[1]);
  recommendations = Object.fromEntries(entries);

  return recommendations
};

console.log(getUserRecommendation(usersFeedback, 'Jessica'))
console.log(getUserRecommendation(usersFeedback, 'Suzane'))
console.log(getUserRecommendation(usersFeedback, 'Mary'))

let recommendation = getUserRecommendation(usersFeedback, 'Fred');
console.log(recommendation)


const getRecommendation = (recommendations, minScore) => {
  let recommendation = [];
  for (let item in recommendations) {
    if (recommendations[item] > minScore) {
      recommendation.push(item);
    }
  }
  return recommendation
};

console.log(getRecommendation(recommendation, 3))


// Similar movies
const usersFeedbackMovies = {
  'The Hobbit': {
    'Mary': 2.5,
    'Peter': 3.0,
    'Stuart': 2.5,
    'Paul': 3.0,
    'Suzane': 3.0
  },
  'The Lord of the Rings': {
    'Mary': 3.5,
    'Peter': 3.5,
    'Stuart': 3.0,
    'Jessica': 3.5,
    'Paul': 4.0,
    'Suzane': 4.0,
    'Fred': 4.5
  },
  'Star Trek': {
    'Mary': 3.0,
    'Peter': 1.5,
    'Jessica': 3.0,
    'Paul': 2.0
  },
  'The Terminator': {
    'Mary': 3.5,
    'Peter': 5.0,
    'Stuart': 3.5,
    'Jessica': 4.0,
    'Paul': 3.0,
    'Suzane': 5.0,
    'Fred': 4.0
  },
  'Norbit': {
    'Mary': 2.5,
    'Peter': 3.0,
    'Jessica': 2.5,
    'Paul': 2.0,
    'Suzane': 3.5,
    'Fred': 1.0
  },
  'Star Wars': {
    'Mary': 3.0,
    'Peter': 3.5,
    'Stuart': 4.0,
    'Jessica': 4.5,
    'Paul': 3.0,
    'Suzane': 3.0
  }
}

console.log(euclidianDistance(usersFeedbackMovies, 'The Terminator', 'Norbit'))
console.log(getSimilarities(usersFeedbackMovies, 'The Terminator'))
console.log(getSimilarities(usersFeedbackMovies, 'Norbit'))
console.log(getUserRecommendation(usersFeedbackMovies, 'The Hobbit'))
console.log(getUserRecommendation(usersFeedbackMovies, 'Norbit'))
console.log(getUserRecommendation(usersFeedbackMovies, 'Star Wars'))

recommendation = getUserRecommendation(usersFeedbackMovies, 'Star Trek')
console.log(recommendation)
console.log(getRecommendation(recommendation, 3))


/* Collaborative filtering - item-based filtering */

console.log(getSimilarities(usersFeedbackMovies, 'The Lord of the Rings'))
console.log(getSimilarities(usersFeedbackMovies, 'The Terminator'))
console.log(getSimilarities(usersFeedbackMovies, 'Norbit'))

// Similarity between movies
const calculateItemSimilarities = (dataset) => {
  let similarities = {};
  Object.keys(dataset).forEach((item) => {
    let similarity = getSimilarities(dataset, item);
    similarities[item] = similarity;
  });
  return similarities;
};

const similarities = calculateItemSimilarities(usersFeedbackMovies);

// Recommendations
const getItemRecommendation = (userDataset, similarities, user) => {
  let scores = {}, totals = {}, userScores = userDataset[user];
  Object.entries(userScores).forEach(([item, score]) => {
    Object.entries(similarities[item]).forEach(([other, similarity]) => {
      if (!(other in userScores)) {
        scores[other] = (scores[other] || 0) + similarity * score;
        totals[other] = (totals[other] || 0) + similarity;
      }
    })
  });

  let recommendations = {};
  Object.entries(scores).forEach(([item, score]) => {
    recommendations[item] = score / totals[item];
  });

  let entries = Object.entries(recommendations);
  entries.sort((a, b) => b[1] - a[1]);
  recommendations = Object.fromEntries(entries);

  return recommendations
};


console.log(getUserRecommendation(usersFeedback, 'Fred'))

recommendation = getItemRecommendation(usersFeedback, similarities, 'Fred');
console.log(recommendation)
console.log(getRecommendation(recommendation, 3))

recommendation = getItemRecommendation(usersFeedback, similarities, 'Stuart');
console.log(recommendation)
console.log(getRecommendation(recommendation, 3))

recommendation = getItemRecommendation(usersFeedback, similarities, 'Jessica');
console.log(recommendation)
console.log(getRecommendation(recommendation, 3))

recommendation = getItemRecommendation(usersFeedback, similarities, 'Suzane');
console.log(recommendation)
console.log(getRecommendation(recommendation, 3))
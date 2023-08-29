/*
*Simon Task es una prueba la cual consiste en responder a una tarea
*dada las instrucciones, sin dar atención a las distracciones que
* aparecen en el experimento
*/
var jsPsych = initJsPsych();

var timeline = [];

/* Media */
var images = ["img/green_o_f_f_b_079.jpg","img/green_o_f_h_a_079.jpg","img/green_o_f_n_b_079.jpg","img/red_o_f_f_b_079.jpg","img/red_o_f_h_a_079.jpg","img/red_o_f_n_b_079.jpg"]

var preload = {
    type: jsPsychPreload,
    images: images,
    auto_preload: true
};

timeline.push(preload);

/* Mensaje de bienvenida */
var bienvenida = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: "Bienvenido al experimento Simón dice. Presiona cualquier tecla para iniciar"
};
timeline.push(bienvenida)

/* Explicación del experimento */
var instrucciones = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
  <p>En este experimento, varias imagenes apareceran en la pantalla</p>
  <p>Si la imagen es <strong>verde</strong> deberás presionar la tecla <strong>F</strong> la más rápido posible.</p>
  <p>Si la imagen es <strong>rojo</strong> deberás presionar la tecla <strong>J</strong> lo más rápido posible.</p>
  <p>Presiona cualquier tecla para empezar.</p>
  <div style='width: 1100px;'>
  <div style='float: left;'><img src='img/green_o_f_f_b_079.jpg'></img>
  <p class='small'><strong>Presiona la tecla F</strong></p></div>
  <div style='float: right;'><img src='img/red_o_f_f_b_079.jpg'></img>
  <p class='small'><strong>Presiona la tecla J</strong></p></div>
  </div>`
};
timeline.push(instrucciones)

/* LIsta de las pruebas */ 
var test_stimuli = [//estimulos posibles,se ponen entre {} para diferenciarlos
    { stimulus: "img/green_o_f_f_b_079.jpg",  
      correct_response: 'f',
      position: 'left'
    },
    { stimulus: "img/green_o_f_h_a_079.jpg",  
      correct_response: 'f',
      position: 'left'
    },
    { stimulus: "img/green_o_f_n_b_079.jpg",  
      correct_response: 'f',
      position: 'left'
    },
    { stimulus: "img/red_o_f_f_b_079.jpg",  
      correct_response: 'j',
      position: 'left'
    },
    { stimulus: "img/red_o_f_h_a_079.jpg",  
      correct_response: 'j',
      position: 'left'
    },
    { stimulus: "img/red_o_f_n_b_079.jpg",  
      correct_response: 'j',
      position: 'left'
    },
    { stimulus: "img/green_o_f_f_b_079.jpg",  
      correct_response: 'f',
      position: 'right'
    },
    { stimulus: "img/green_o_f_h_a_079.jpg",  
      correct_response: 'f',
      position: 'right'
    },
    { stimulus: "img/green_o_f_n_b_079.jpg",  
      correct_response: 'f',
      position: 'right'
    },
    { stimulus: "img/red_o_f_f_b_079.jpg",  
      correct_response: 'j',
      position: 'right'
    },
    { stimulus: "img/red_o_f_h_a_079.jpg",  
      correct_response: 'j',
      position: 'right'
    },
    { stimulus: "img/red_o_f_n_b_079.jpg",  
      correct_response: 'j',
      position: 'right'
    }
];

//Pone la cruz en la pantalla
var fixation = { //mensaje entre ensayos
    type: jsPsychHtmlKeyboardResponse,
    stimulus: '<div style="font-size:60px;">+</div>',
    choices: jsPsych.NO_KEYS, //posible elecciones, puesto a sin respuesta
    trial_duration: 500, //duracion de la prueba, 500 ms
      data: {
      task: 'fixation'
    }
}
  
//Ponemos la imagen
var test = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function(){
                var html = `
                  <div style='width: 1100px;'>
                    <div style='float: ${jsPsych.timelineVariable('position')};'>
                      <img src="${jsPsych.timelineVariable('stimulus')}">
                    </div>
                  </div>`;
                return html;
            },
    choices: ['f', 'j'],  //posibles elecciones del teclado
    data: {
      task: 'response',
      correct_response: jsPsych.timelineVariable('correct_response'),
      position: jsPsych.timelineVariable('position'),
      imagen_stim: jsPsych.timelineVariable('stimulus')
    },
    on_finish: function(data){
      data.correct = jsPsych.pluginAPI.compareKeys(data.response, data.correct_response);
    }
}  
  
//Pruebas a hacer
var test_procedure = {
    timeline: [fixation, test],
    timeline_variables: test_stimuli,
    randomize_order: true,//hace las pruebas al azar
    repetitions: 2 //numeros de veces que se va a repetir
}

timeline.push(test_procedure);

/* Resultados finales */
var debrief_block = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: function() {

    var trials = jsPsych.data.get().filter({task: 'response'});
    var correct_trials = trials.filter({correct: true});
    var accuracy = Math.round(correct_trials.count() / trials.count() * 100);
    var rt = Math.round(correct_trials.select('rt').mean());

    return `<p>Tus respuestas correctas fueron ${accuracy}% de las pruebas.</p>
      <p>Tú tiempo de respuesta promedio fue ${rt}ms.</p>
      <p>Presiona cualquier tecla para terminar el experimento. Gracias!</p>`;

  }
};
timeline.push(debrief_block);

const subject_id = jsPsych.randomization.randomID(10);
const filename = `${subject_id}.csv`;


const save_data = {
    type: jsPsychPipe,
    action: "save",
    experiment_id: "HJEmGu1tTxK1",
    filename: filename,
    data_string: ()=>jsPsych.data.get().csv()
};

timeline.push(save_data);

jsPsych.run(timeline);

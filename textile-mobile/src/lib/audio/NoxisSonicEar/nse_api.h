// Copyright 2020-2021 Alpha Cephei Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//       http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/* This header contains the C API for NSE speech recognition system */

#ifndef NSE_API_H
#define NSE_API_H

#ifdef __cplusplus
extern "C" {
#endif

/** Model stores all the data required for recognition
 *  it contains static data and can be shared across processing
 *  threads. */
typedef struct NSEModel NSEModel;


/** Speaker model is the same as model but contains the data
 *  for speaker identification. */
typedef struct NSESpkModel NSESpkModel;


/** Recognizer object is the main object which processes data.
 *  Each recognizer usually runs in own thread and takes audio as input.
 *  Once audio is processed recognizer returns JSON object as a string
 *  which represent decoded information - words, confidences, times, n-best lists,
 *  speaker information and so on */
typedef struct NSERecognizer NSERecognizer;

/** Inverse text normalization */
typedef struct NSETextProcessor NSETextProcessor;

/**
 * Batch model object
 */
typedef struct NSEBatchModel NSEBatchModel;

/**
 * Batch recognizer object
 */
typedef struct NSEBatchRecognizer NSEBatchRecognizer;


/** Loads model data from the file and returns the model object
 *
 * @param model_path: the path of the model on the filesystem
 * @returns model object or NULL if problem occured */
NSEModel *NSE_model_new(const char *model_path);


/** Releases the model memory
 *
 *  The model object is reference-counted so if some recognizer
 *  depends on this model, model might still stay alive. When
 *  last recognizer is released, model will be released too. */
void NSE_model_free(NSEModel *model);


/** Check if a word can be recognized by the model
 * @param word: the word
 * @returns the word symbol if @param word exists inside the model
 * or -1 otherwise.
 * Reminding that word symbol 0 is for <epsilon> */
int NSE_model_find_word(NSEModel *model, const char *word);


/** Loads speaker model data from the file and returns the model object
 *
 * @param model_path: the path of the model on the filesystem
 * @returns model object or NULL if problem occurred */
NSESpkModel *NSE_spk_model_new(const char *model_path);


/** Releases the model memory
 *
 *  The model object is reference-counted so if some recognizer
 *  depends on this model, model might still stay alive. When
 *  last recognizer is released, model will be released too. */
void NSE_spk_model_free(NSESpkModel *model);

/** Creates the recognizer object
 *
 *  The recognizers process the speech and return text using shared model data
 *  @param model       NSEModel containing static data for recognizer. Model can be
 *                     shared across recognizers, even running in different threads.
 *  @param sample_rate The sample rate of the audio you going to feed into the recognizer.
 *                     Make sure this rate matches the audio content, it is a common
 *                     issue causing accuracy problems.
 *  @returns recognizer object or NULL if problem occured */
NSERecognizer *NSE_recognizer_new(NSEModel *model, float sample_rate);


/** Creates the recognizer object with speaker recognition
 *
 *  With the speaker recognition mode the recognizer not just recognize
 *  text but also return speaker vectors one can use for speaker identification
 *
 *  @param model       NSEModel containing static data for recognizer. Model can be
 *                     shared across recognizers, even running in different threads.
 *  @param sample_rate The sample rate of the audio you going to feed into the recognizer.
 *                     Make sure this rate matches the audio content, it is a common
 *                     issue causing accuracy problems.
 *  @param spk_model speaker model for speaker identification
 *  @returns recognizer object or NULL if problem occured */
NSERecognizer *NSE_recognizer_new_spk(NSEModel *model, float sample_rate, NSESpkModel *spk_model);


/** Creates the recognizer object with the phrase list
 *
 *  Sometimes when you want to improve recognition accuracy and when you don't need
 *  to recognize large vocabulary you can specify a list of phrases to recognize. This
 *  will improve recognizer speed and accuracy but might return [unk] if user said
 *  something different.
 *
 *  Only recognizers with lookahead models support this type of quick configuration.
 *  Precompiled HCLG graph models are not supported.
 *
 *  @param model       NSEModel containing static data for recognizer. Model can be
 *                     shared across recognizers, even running in different threads.
 *  @param sample_rate The sample rate of the audio you going to feed into the recognizer.
 *                     Make sure this rate matches the audio content, it is a common
 *                     issue causing accuracy problems.
 *  @param grammar The string with the list of phrases to recognize as JSON array of strings,
 *                 for example "["one two three four five", "[unk]"]".
 *
 *  @returns recognizer object or NULL if problem occured */
NSERecognizer *NSE_recognizer_new_grm(NSEModel *model, float sample_rate, const char *grammar);


/** Adds speaker model to already initialized recognizer
 *
 * Can add speaker recognition model to already created recognizer. Helps to initialize
 * speaker recognition for grammar-based recognizer.
 *
 * @param spk_model Speaker recognition model */
void NSE_recognizer_set_spk_model(NSERecognizer *recognizer, NSESpkModel *spk_model);


/** Reconfigures recognizer to use grammar
 *
 * @param recognizer   Already running NSERecognizer
 * @param grammar      Set of phrases in JSON array of strings or "[]" to use default model graph.
 *                     See also NSE_recognizer_new_grm
 */
void NSE_recognizer_set_grm(NSERecognizer *recognizer, char const *grammar);


/** Configures recognizer to output n-best results
 *
 * <pre>
 *   {
 *      "alternatives": [
 *          { "text": "one two three four five", "confidence": 0.97 },
 *          { "text": "one two three for five", "confidence": 0.03 },
 *      ]
 *   }
 * </pre>
 *
 * @param max_alternatives - maximum alternatives to return from recognition results
 */
void NSE_recognizer_set_max_alternatives(NSERecognizer *recognizer, int max_alternatives);


/** Enables words with times in the output
 *
 * <pre>
 *   "result" : [{
 *       "conf" : 1.000000,
 *       "end" : 1.110000,
 *       "start" : 0.870000,
 *       "word" : "what"
 *     }, {
 *       "conf" : 1.000000,
 *       "end" : 1.530000,
 *       "start" : 1.110000,
 *       "word" : "zero"
 *     }, {
 *       "conf" : 1.000000,
 *       "end" : 1.950000,
 *       "start" : 1.530000,
 *       "word" : "zero"
 *     }, {
 *       "conf" : 1.000000,
 *       "end" : 2.340000,
 *       "start" : 1.950000,
 *       "word" : "zero"
 *     }, {
 *       "conf" : 1.000000,
 *       "end" : 2.610000,
 *       "start" : 2.340000,
 *       "word" : "one"
 *     }],
 * </pre>
 *
 * @param words - boolean value
 */
void NSE_recognizer_set_words(NSERecognizer *recognizer, int words);

/** Like above return words and confidences in partial results
 *
 * @param partial_words - boolean value
 */
void NSE_recognizer_set_partial_words(NSERecognizer *recognizer, int partial_words);

/** Set NLSML output
 * @param nlsml - boolean value
 */
void NSE_recognizer_set_nlsml(NSERecognizer *recognizer, int nlsml);

typedef enum NSEEpMode {
    NSE_EP_ANSWER_DEFAULT = 0,
    NSE_EP_ANSWER_SHORT = 1,
    NSE_EP_ANSWER_LONG = 2,
    NSE_EP_ANSWER_VERY_LONG = 3,
} NSEEndpointerMode;

/**
 * Set endpointer scaling factor
 *
 * @param mode - Endpointer mode
 **/
void NSE_recognizer_set_endpointer_mode(NSERecognizer *recognizer,  NSEEndpointerMode mode);

/**
 * Set endpointer delays
 *
 * @param t_start_max     timeout for stopping recognition in case of initial silence (usually around 5.0)
 * @param t_end           timeout for stopping recognition in milliseconds after we recognized something (usually around 0.5 - 1.0)
 * @param t_max           timeout for forcing utterance end in milliseconds (usually around 20-30)
 **/
void NSE_recognizer_set_endpointer_delays(NSERecognizer *recognizer, float t_start_max, float t_end, float t_max);

/** Accept voice data
 *
 *  accept and process new chunk of voice data
 *
 *  @param data - audio data in PCM 16-bit mono format
 *  @param length - length of the audio data
 *  @returns 1 if silence is occured and you can retrieve a new utterance with result method 
 *           0 if decoding continues
 *           -1 if exception occured */
int NSE_recognizer_accept_waveform(NSERecognizer *recognizer, const char *data, int length);


/** Same as above but the version with the short data for language bindings where you have
 *  audio as array of shorts */
int NSE_recognizer_accept_waveform_s(NSERecognizer *recognizer, const short *data, int length);


/** Same as above but the version with the float data for language bindings where you have
 *  audio as array of floats */
int NSE_recognizer_accept_waveform_f(NSERecognizer *recognizer, const float *data, int length);


/** Returns speech recognition result
 *
 * @returns the result in JSON format which contains decoded line, decoded
 *          words, times in seconds and confidences. You can parse this result
 *          with any json parser
 *
 * <pre>
 *  {
 *    "text" : "what zero zero zero one"
 *  }
 * </pre>
 *
 * If alternatives enabled it returns result with alternatives, see also NSE_recognizer_set_max_alternatives().
 *
 * If word times enabled returns word time, see also NSE_recognizer_set_word_times().
 */
const char *NSE_recognizer_result(NSERecognizer *recognizer);


/** Returns partial speech recognition
 *
 * @returns partial speech recognition text which is not yet finalized.
 *          result may change as recognizer process more data.
 *
 * <pre>
 * {
 *    "partial" : "cyril one eight zero"
 * }
 * </pre>
 */
const char *NSE_recognizer_partial_result(NSERecognizer *recognizer);


/** Returns speech recognition result. Same as result, but doesn't wait for silence
 *  You usually call it in the end of the stream to get final bits of audio. It
 *  flushes the feature pipeline, so all remaining audio chunks got processed.
 *
 *  @returns speech result in JSON format.
 */
const char *NSE_recognizer_final_result(NSERecognizer *recognizer);


/** Resets the recognizer
 *
 *  Resets current results so the recognition can continue from scratch */
void NSE_recognizer_reset(NSERecognizer *recognizer);


/** Releases recognizer object
 *
 *  Underlying model is also unreferenced and if needed released */
void NSE_recognizer_free(NSERecognizer *recognizer);

/** Set log level for Kaldi messages
 *
 *  @param log_level the level
 *     0 - default value to print info and error messages but no debug
 *     less than 0 - don't print info messages
 *     greater than 0 - more verbose mode
 */
void NSE_set_log_level(int log_level);

/**
 *  Init, automatically select a CUDA device and allow multithreading.
 *  Must be called once from the main thread.
 *  Has no effect if HAVE_CUDA flag is not set.
 */
void NSE_gpu_init();

/**
 *  Init CUDA device in a multi-threaded environment.
 *  Must be called for each thread.
 *  Has no effect if HAVE_CUDA flag is not set.
 */
void NSE_gpu_thread_init();

/** Creates the batch recognizer object
 *
 *  @returns model object or NULL if problem occured */
NSEBatchModel *NSE_batch_model_new(const char *model_path);

/** Releases batch model object */
void NSE_batch_model_free(NSEBatchModel *model);

/** Wait for the processing */
void NSE_batch_model_wait(NSEBatchModel *model);

/** Creates batch recognizer object
 *  @returns recognizer object or NULL if problem occured */
NSEBatchRecognizer *NSE_batch_recognizer_new(NSEBatchModel *model, float sample_rate);
 
/** Releases batch recognizer object */
void NSE_batch_recognizer_free(NSEBatchRecognizer *recognizer);

/** Accept batch voice data */
void NSE_batch_recognizer_accept_waveform(NSEBatchRecognizer *recognizer, const char *data, int length);

/** Set NLSML output
 * @param nlsml - boolean value
 */
void NSE_batch_recognizer_set_nlsml(NSEBatchRecognizer *recognizer, int nlsml);

/** Closes the stream */
void NSE_batch_recognizer_finish_stream(NSEBatchRecognizer *recognizer);

/** Return results */
const char *NSE_batch_recognizer_front_result(NSEBatchRecognizer *recognizer);

/** Release and free first retrieved result */
void NSE_batch_recognizer_pop(NSEBatchRecognizer *recognizer);

/** Get amount of pending chunks for more intelligent waiting */
int NSE_batch_recognizer_get_pending_chunks(NSEBatchRecognizer *recognizer);

/** Create text processor */
NSETextProcessor *NSE_text_processor_new(const char *tagger, const char *verbalizer);

/** Release text processor */
void NSE_text_processor_free(NSETextProcessor *processor);

/** Convert string */
char *NSE_text_processor_itn(NSETextProcessor *processor, const char *input);

#ifdef __cplusplus
}
#endif

#endif /* NSE_API_H */

// Copyright 2020 Alpha Cephei Inc.
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

#include "nse_api.h"

#include "recognizer.h"
#include "model.h"
#include "spk_model.h"
#include "postprocessor.h"

#if HAVE_CUDA
#include "cudamatrix/cu-device.h"
#include "batch_recognizer.h"
#endif

#include <string.h>

using namespace kaldi;

NSEModel *NSE_model_new(const char *model_path)
{
    try {
        return (NSEModel *)new Model(model_path);
    } catch (...) {
        return nullptr;
    }
}

void NSE_model_free(NSEModel *model)
{
    if (model == nullptr) {
       return;
    }
    ((Model *)model)->Unref();
}

int NSE_model_find_word(NSEModel *model, const char *word)
{
    return (int) ((Model *)model)->FindWord(word);
}

NSESpkModel *NSE_spk_model_new(const char *model_path)
{
    try {
        return (NSESpkModel *)new SpkModel(model_path);
    } catch (...) {
        return nullptr;
    }
}

void NSE_spk_model_free(NSESpkModel *model)
{
    if (model == nullptr) {
       return;
    }
    ((SpkModel *)model)->Unref();
}

NSERecognizer *NSE_recognizer_new(NSEModel *model, float sample_rate)
{
    try {
        return (NSERecognizer *)new Recognizer((Model *)model, sample_rate);
    } catch (...) {
        return nullptr;
    }
}

NSERecognizer *NSE_recognizer_new_spk(NSEModel *model, float sample_rate, NSESpkModel *spk_model)
{
    try {
        return (NSERecognizer *)new Recognizer((Model *)model, sample_rate, (SpkModel *)spk_model);
    } catch (...) {
        return nullptr;
    }
}

NSERecognizer *NSE_recognizer_new_grm(NSEModel *model, float sample_rate, const char *grammar)
{
    try {
        return (NSERecognizer *)new Recognizer((Model *)model, sample_rate, grammar);
    } catch (...) {
        return nullptr;
    }
}

void NSE_recognizer_set_max_alternatives(NSERecognizer *recognizer, int max_alternatives)
{
    ((Recognizer *)recognizer)->SetMaxAlternatives(max_alternatives);
}

void NSE_recognizer_set_words(NSERecognizer *recognizer, int words)
{
    ((Recognizer *)recognizer)->SetWords((bool)words);
}

void NSE_recognizer_set_partial_words(NSERecognizer *recognizer, int partial_words)
{
    ((Recognizer *)recognizer)->SetPartialWords((bool)partial_words);
}

void NSE_recognizer_set_nlsml(NSERecognizer *recognizer, int nlsml)
{
    ((Recognizer *)recognizer)->SetNLSML((bool)nlsml);
}

void NSE_recognizer_set_spk_model(NSERecognizer *recognizer, NSESpkModel *spk_model)
{
    if (recognizer == nullptr || spk_model == nullptr) {
       return;
    }
    ((Recognizer *)recognizer)->SetSpkModel((SpkModel *)spk_model);
}

void NSE_recognizer_set_grm(NSERecognizer *recognizer, char const *grammar)
{
    if (recognizer == nullptr) {
       return;
    }
    ((Recognizer *)recognizer)->SetGrm(grammar);
}

void NSE_recognizer_set_endpointer_mode(NSERecognizer *recognizer, NSEEndpointerMode mode)
{
    if (recognizer == nullptr) {
       return;
    }
    ((Recognizer *)recognizer)->SetEndpointerMode(mode);
}

void NSE_recognizer_set_endpointer_delays(NSERecognizer *recognizer, float t_start_max, float t_end, float t_max)
{
    if (recognizer == nullptr) {
       return;
    }
    ((Recognizer *)recognizer)->SetEndpointerDelays(t_start_max, t_end, t_max);
}

int NSE_recognizer_accept_waveform(NSERecognizer *recognizer, const char *data, int length)
{
    try {
        return ((Recognizer *)(recognizer))->AcceptWaveform(data, length);
    } catch (...) {
        return -1;
    }
}

int NSE_recognizer_accept_waveform_s(NSERecognizer *recognizer, const short *data, int length)
{
    try {
        return ((Recognizer *)(recognizer))->AcceptWaveform(data, length);
    } catch (...) {
        return -1;
    }
}

int NSE_recognizer_accept_waveform_f(NSERecognizer *recognizer, const float *data, int length)
{
    try {
        return ((Recognizer *)(recognizer))->AcceptWaveform(data, length);
    } catch (...) {
        return -1;
    }
}

const char *NSE_recognizer_result(NSERecognizer *recognizer)
{
    return ((Recognizer *)recognizer)->Result();
}

const char *NSE_recognizer_partial_result(NSERecognizer *recognizer)
{
    return ((Recognizer *)recognizer)->PartialResult();
}

const char *NSE_recognizer_final_result(NSERecognizer *recognizer)
{
    return ((Recognizer *)recognizer)->FinalResult();
}

void NSE_recognizer_reset(NSERecognizer *recognizer)
{
    ((Recognizer *)recognizer)->Reset();
}

void NSE_recognizer_free(NSERecognizer *recognizer)
{
    delete (Recognizer *)(recognizer);
}

void NSE_set_log_level(int log_level)
{
    SetVerboseLevel(log_level);
}

void NSE_gpu_init()
{
#if HAVE_CUDA
//    kaldi::CuDevice::EnableTensorCores(true);
//    kaldi::CuDevice::EnableTf32Compute(true);
    kaldi::CuDevice::Instantiate().SelectGpuId("yes");
    kaldi::CuDevice::Instantiate().AllowMultithreading();
#endif
}

void NSE_gpu_thread_init()
{
#if HAVE_CUDA
    kaldi::CuDevice::Instantiate();
#endif
}

NSEBatchModel *NSE_batch_model_new(const char *model_path)
{
#if HAVE_CUDA
    return (NSEBatchModel *)(new BatchModel(model_path));
#else
    return NULL;
#endif
}

void NSE_batch_model_free(NSEBatchModel *model)
{
#if HAVE_CUDA
    delete ((BatchModel *)model);
#endif
}

void NSE_batch_model_wait(NSEBatchModel *model)
{
#if HAVE_CUDA
    ((BatchModel *)model)->WaitForCompletion();
#endif
}

NSEBatchRecognizer *NSE_batch_recognizer_new(NSEBatchModel *model, float sample_rate)
{
#if HAVE_CUDA
    return (NSEBatchRecognizer *)(new BatchRecognizer((BatchModel *)model, sample_rate));
#else
    return NULL;
#endif
}

void NSE_batch_recognizer_free(NSEBatchRecognizer *recognizer)
{
#if HAVE_CUDA
    delete ((BatchRecognizer *)recognizer);
#endif
}

void NSE_batch_recognizer_accept_waveform(NSEBatchRecognizer *recognizer, const char *data, int length)
{
#if HAVE_CUDA
    ((BatchRecognizer *)recognizer)->AcceptWaveform(data, length);
#endif
}

void NSE_batch_recognizer_set_nlsml(NSEBatchRecognizer *recognizer, int nlsml)
{
#if HAVE_CUDA
    ((BatchRecognizer *)recognizer)->SetNLSML((bool)nlsml);
#endif
}

void NSE_batch_recognizer_finish_stream(NSEBatchRecognizer *recognizer)
{
#if HAVE_CUDA
    ((BatchRecognizer *)recognizer)->FinishStream();
#endif
}

const char *NSE_batch_recognizer_front_result(NSEBatchRecognizer *recognizer)
{
#if HAVE_CUDA
    return ((BatchRecognizer *)recognizer)->FrontResult();
#else
    return NULL;
#endif
}

void NSE_batch_recognizer_pop(NSEBatchRecognizer *recognizer)
{
#if HAVE_CUDA
    ((BatchRecognizer *)recognizer)->Pop();
#endif
}


int NSE_batch_recognizer_get_pending_chunks(NSEBatchRecognizer *recognizer)
{
#if HAVE_CUDA
    return ((BatchRecognizer *)recognizer)->GetNumPendingChunks();
#else
    return 0;
#endif
}

NSETextProcessor *NSE_text_processor_new(const char *tagger, const char *verbalizer)
{
    try {
        return (NSETextProcessor *)new Processor(tagger, verbalizer);
    } catch (...) {
        return nullptr;
    }
}

void NSE_text_processor_free(NSETextProcessor *processor)
{
    delete ((Processor *)processor);
}

char *NSE_text_processor_itn(NSETextProcessor *processor, const char *input)
{
    Processor *wprocessor = (Processor *)processor;
    std::string sinput(input);

    std::string tagged_text = wprocessor->Tag(sinput);
    std::string normalized_text = wprocessor->Verbalize(tagged_text);

    return strdup(normalized_text.c_str());
}

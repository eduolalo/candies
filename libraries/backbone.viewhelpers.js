(function(){

  var viewhelpers = window.viewhelpers = {};
  viewhelpers.buttons = {};
  viewhelpers.inputs = {};

  // empty function
  var stub = function(){};

  /**
   * utils plugins shorcuts 
   */
  viewhelpers.widgets = {
    events: {
      'focusin .decimal': 'onFocusInDecimal',
    },
    tooltips: function() {
      $('.tooltip').remove();
      this.$('[rel=tooltip]').tooltip();
    }, 
    numerics: function() {
      this.$('.numeric').numeric({decimal: false});
      _.each(this.$('.numeric'), function(item) {
        if (!$(item).prop('pattern')) {
          $(item).attr('pattern', App.get('patterns.positive'));
        }
      });
      this.$('.negative').removeAttr('pattern');
    },
    decimals: function() {
      this.$('.decimal').numeric().each(function() {
        $(this).attr('pattern', App.get('patterns.amount'));
      });
    },
    timepickers: function(options) {
      if (!options) {
        options = {};
      }
      this.$('.timepicker').each(function() {
        var el = $(this);
        el.timepicker(options);
        el.attr('pattern', '[0-9]{2}:[0-9]{2}');
        el.mask('99:99');
      });
    },
    onFocusInDecimal: function(e) {
      var target = $(e.currentTarget);
      target.select();
    },
    editor: function(selector) {
      var self = this;
      return self.$(selector + ':first').wysihtml5({
        'font-styles': true,
        emphasis: true,
        lists: true,
        color: false,
        html: false,
        link: false,
        image: false,
        locale: "es-ES",
      }).data('wysihtml5').editor;
    },
    datepickers: function(options) {
      var _options = {
        withTimeChooser: false,
      }
      if(typeof options != "undefined") {
        _options = options;
      }
      
      if(_options.withTimeChooser) {
        this.$('.datepicker').datetimepicker({
          currentText: __('Ahora'),
          timeFormat: 'HH:mm',
          dateFormat: 'dd/mm/yy',
          showOn: "button",
          buttonText: "<i class='icon-calendar'></i>",
          showButtonPanel: true,
          stepMinute: 10,
          showTime: false,
          hourText: __('Hora'),
          minuteText: __('Minuto'),
        });
        this.$('.ui-datepicker-trigger').attr('data-title', __('Seleccionar fecha con hora'));
        this.$('.datepicker').mask("99/99/9999 99:99");
        this.$('.datepicker').attr('pattern', App.patterns.datetime);
        $('button.ui-datepicker-current').live('click', function() {
          $.datepicker._curInst.input.datepicker('setDate', new Date()).datepicker('hide').blur();
        });
      } else {
        this.$('.datepicker').datepicker({
          dateFormat: 'dd/mm/yy',
          currentText: __('Hoy'),
          showOn: "button",
          buttonText: "<i class='icon-calendar'></i>",
          showButtonPanel: true,
        });
        this.$('.ui-datepicker-trigger').attr('data-title', __('Seleccionar fecha'));
        this.$('.datepicker').mask("99/99/9999");
        this.$('.datepicker').attr('pattern', App.patterns.date);
        $('button.ui-datepicker-current').live('click', function() {
          $.datepicker._curInst.input.datepicker('setDate', new Date()).datepicker('hide').blur();
        });
      }
      this.$('.ui-datepicker-trigger').addClass('btn');
      this.$('.ui-datepicker-trigger').attr('rel', 'tooltip');
      this.tooltips();
      
    },
    scrollpanes: function() {
      this.$('.scrollpane').jScrollPane();
    },
    rfcs: function(){
      this.$('.rfc').attr('pattern', App.get('patterns.rfc'));
    },
    curps: function(){
      this.$('.curp').attr('pattern', App.get('patterns.curp'));
    }
  };

  /**
   * Boton de Refrescar pantalla
   */
  viewhelpers.buttons.refresh = {
    events: {
      'click #refresh': 'refreshModel',
    },
    refreshModel: function(e) {
      var self = this;
      var target = $(e.currentTarget);
      spinerize(target);
      self.model.fetch().done(function() {
        self.render();
      }).always(function() {
        despinerize(target);
      });
    },
  };

  /**
   * Boton de Imprimir vista
   */
  viewhelpers.buttons.print = {
    events: {
      'click #print': 'onPrint',
    },
    onPrint: function(e) {
      this.printElement(this.$el);
    },
    printElement: function(elem) {
      elem.printArea();
    },
  };

  /**
   * Boton para guardar los cambios
   */
  viewhelpers.buttons.update = {
    events: {
      'click #update': 'onUpdate',
    },
    onUpdate: function(e) {
      var self = this;
      var target = $(e.currentTarget);
      spinerize(target, {disabled: true});
      var model = new documents.models.UpdateDocument(self.serializeUpdate());
      model.set({
        id: self.model.get('id'),
        folio: self.model.get('folio'),
      });
      model.addParam('docto', self.model.get('docto'));
      model.save().done(function() {
        self.postUpdate();
        self.model.fetch().done(function() {
          self.render();
        }).always(function() {
          despinerize(target);  
        });
      }).fail(function() {
        despinerize(target);
      });
    },
    serializeUpdate: function() {
      return this.model.toJSON();
    },
    postUpdate: function() {},
  };

  /**
   * Form helpers
   */
  viewhelpers.forms = {
    fillFormByInputNames: function(object){
      for (name in object) {
        var value = object[name];
        this.$('[name=' + name + ']').val(value);
      }
    },
    fillInputs: function(obj, el) {
      if (!el) {
        el = this.$el;
      }
      for (index in obj) {
        el.find("#" + index).val(obj[index]);
      }
    },
    validationOK: function(selector) {
      var self = this;
      var query = 'label.invalid[for="' + selector.attr('id') + '"]';
      var label = this.$(query);
      label.fadeOut(0);
      selector.removeClass('invalid');
      self.resizeVitrine();
    },
    validationError: function(selector) {
      var self = this;
      var query = 'label.invalid[for="' + selector.attr('id') + '"]';
      var label = this.$(query);
      label.fadeIn(0);
      selector.addClass('invalid');
      selector.focus();
      self.resizeVitrine();
      selector.one('keydown', function() {
        selector.removeClass('invalid');
        label.fadeOut(0);
        self.resizeVitrine();
      });
      selector.one('focusout', function() {
        selector.removeClass('invalid');
        label.fadeOut(0);
        self.resizeVitrine();
      });
    },
    validateField: function(selector, fn) {
      var self = this;
      if (_.isFunction(fn)) {
        if (fn()) {
          self.validationOK(selector);
        } else {
          self.validationError(selector);
        }
      } else {
        self.validationError(selector);
      }
    },
  };

  /**
   * Input para poder cambiar de id y recargar la vista
   */
  viewhelpers.inputs.changeId = {
    events: {
      'keydown .change-id': 'onChangeId',  
    },
    onChangeId: function(e) {
      var self = this;
      if (e.which == 13) {
        e.stopPropagation();
        e.preventDefault();
        var target = $(e.currentTarget);
        var id = target.val();
        if (id != self.model.get('id')) {
          self.model.clear({silent: true});
          self.model.set('id', id);
          spinerize(target);
          self.model.fetch().done(function(out) {
            if (_.isEmpty(out)) {
              self.notFoundChangeId();
            } else {
              self.render();
              self.successChangeId();
            }
          }).fail(function(){
            self.failChangeId();
          }).always(function() {
            despinerize(target);
          });  
        } 
      }
    },
    successChangeId: stub,
    failChangeId: stub,
    notFoundChangeId: stub,
  };

  viewhelpers.inputs.decimalFormatter = {
    events: {
      'focusin .decimal-formatter' : 'onFocusInDecimalFormatter',
      'focusout .decimal-formatter' : 'onFocusOutDecimalFormatter',
    },
    onFocusInDecimalFormatter: function(e) {
      var target = $(e.currentTarget);
      target.val(target.val().replace(/\,/g, ''));
      target.select();
    },
    onFocusOutDecimalFormatter: function(e) {
      var target = $(e.currentTarget);
      var decimals = target.data('formatter-decimals');
      decimals = decimals !== undefined ? decimals : 2;
      target.val(number_format(target.val().replace(/\,/g, ''), decimals));
    }
  };

})();


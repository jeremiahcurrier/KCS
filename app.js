(function(){

  return {
  
    requests: {
    
      fetchPopular: function(){
        return {
          url: 'https://zendesk.inbenta.com/?project=zendesk_hc_'+this.settings.subdomain+'_en&action=default&output=html&matchrating=no&userProfile[access_level]=agents&urltarget=new-tab&zendeskBaseURL=https://'+this.settings.subdomain+'.zendesk.com',
          type: 'GET',
          dataType: 'html'
        };
      },
      
      fetchAnswers: function(question){
        return {
          url: 'https://zendesk.inbenta.com/?project=zendesk_hc_'+this.settings.subdomain+'_en&action=search&question='+question+'&output=html&matchrating=no&userProfile[access_level]=agents&urltarget=new-tab&zendeskBaseURL=https://'+this.settings.subdomain+'.zendesk.com',
          type: 'GET',
          dataType: 'html'
        };
      },
      
      clickAnswer: function(clickInfo){
        return {
          url: 'https://zendesk.inbenta.com/?project=zendesk_hc_'+this.settings.subdomain+'_en&action=click&click='+clickInfo+'&output=html&matchrating=no&userProfile[access_level]=agents&urltarget=new-tab&zendeskBaseURL=https://'+this.settings.subdomain+'.zendesk.com',
          type: 'GET',
          dataType: 'html'
        };
      }
    
    },
    
    events: {
    
      'app.activated': 'initializeUI',
      
      'fetchPopular.always': function(data){
        var searchBoxHtml='<div class="form"><form id="inbentaForm" method="POST"><input type="text" class="search-box inbentasearch" id="inbentaUQ" name="uq" value="" /></form></div>';
        this.switchTo('results',{
          html: searchBoxHtml+this.parseResults(data)
        });
      },
      
      'fetchAnswers.always': function(data){
        var searchBoxHtml='<div class="form"><form id="inbentaForm" method="POST"><input type="text" class="search-box inbentasearch" id="inbentaUQ" name="uq" value="" /></form></div>';
        this.switchTo('results',{
          html: searchBoxHtml+this.parseResults(data)
        });
      },
      
      'submit #inbentaForm': function(event){
        event.preventDefault();
        var question=this.$('.inbentasearch').val();
        this.ajax('fetchAnswers',question);
      },
      
      'click .result-title-lnk': function(event){
        //this.ajax('clickAnswer');
      },
      
      'click .inbentasearch': function(event){
        this.$('.inbentasearch').val('');
      }
    
    },
    
    initializeUI: function(){
      var ticket=this.ticket();
      var subject=ticket.subject();
      if(subject){
        this.ajax('fetchAnswers',subject);
      }
      else{
        this.ajax('fetchPopular');
      }
    },
    
    parseResults: function(data){
      data=data.replace('<result><![CDATA[','').replace(']]></result>','');
      return data;
    }
  
  };

}());
SlideTransition = {
  componentWillEnter: function (done) {
    var $this = $(this.getDOMNode());
    $this.css('display', 'none');
    $this.slideDown(100, 'swing', done);
  },
  componentWillLeave: function (done) {
    var $this = $(this.getDOMNode());
    $this.slideUp(100, 'swing', done);
  }
};

module.exports = SlideTransition;
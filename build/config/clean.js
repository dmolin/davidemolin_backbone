module.exports = function clean(grunt) {
    return { clean: ['<%= workdir %>','<%= distdir %>'] };
};

// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * This file contains an AMD/jQuery module to expand and collapse course rubrics.
 *
 * @package    block_filtered_course_list
 * @copyright  2016 CLAMP
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
var define =
    window.define ||
    ((dependencies, callback) => {
      var $ = window.jQuery;
      callback($);
    });

define(['jquery'], ($) => {
  /**
   * Simple storage helper using localStorage
   */
  var storage = {
    set: (key, value) => {
      try {
        localStorage.setItem('block_fcl_' + key, value);
      } catch (e) {
        // Silently fail if localStorage is not available
      }
    },
    get: (key) => {
      try {
        return localStorage.getItem('block_fcl_' + key);
      } catch (e) {
        return null;
      }
    },
  };

  /**
   * Expand a rubric.
   *
   * @function expandRubric
   * @param {Element} rubric
   * @param {Integer} persist
   */
  function expandRubric(rubric, persist) {
    $(rubric).removeClass('block-fcl__rubric--collapsed');
    $(rubric).addClass('block-fcl__rubric--expanded');
    $(rubric).attr('aria-expanded', 'true');
    $(rubric).next().attr('aria-hidden', 'false');
    if (persist == 1) {
      storage.set(rubric.dataset.hash, 'expanded');
    }
  }

  /**
   * Collapse a rubric.
   *
   * @function collapseRubric
   * @param {Element} rubric
   * @param {Integer} persist
   */
  function collapseRubric(rubric, persist) {
    $(rubric).removeClass('block-fcl__rubric--expanded');
    $(rubric).addClass('block-fcl__rubric--collapsed');
    $(rubric).attr('aria-expanded', 'false');
    $(rubric).next().attr('aria-hidden', 'true');
    if (persist == 1) {
      storage.set(rubric.dataset.hash, 'collapsed');
    }
  }

  return {
    init: (params) => {
      var blockid = params.blockid;
      $('#' + blockid + ' .block-fcl__rubric').each(function() {
        var state = storage.get(this.dataset.hash);
        if (!$(this).hasClass('block-fcl__rubric--expanded') && (!state || state == 'collapsed')) {
          collapseRubric(this, params.persist);
        }
        $(this).wrapInner(document.createElement('a'));
        $(this).find('a').attr('href', '#');
        $(this).on('click', function(event) {
          event.preventDefault();
          $('.block-fcl__rubric').each(function() {
            $(this).attr('aria-selected', 'false');
          });
          $(this).attr('aria-selected', 'true');
          if ($(this).hasClass('block-fcl__rubric--collapsed')) {
            expandRubric(this, params.persist);
          } else if ($(this).hasClass('block-fcl__rubric--expanded')) {
            collapseRubric(this, params.persist);
          }
        });
      });
    },
  };
});

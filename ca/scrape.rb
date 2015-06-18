require 'capybara'
require 'capybara/poltergeist'
require 'pp'
require 'colored'

Capybara.default_driver = :poltergeist

class CaliLaws
  include Capybara::DSL

  attr_reader :section_titles

  def initialize
    @section_titles = []
  end

  def run
    get_sections
    loop_through_sections
  end

  private

    def visit_home
      visit "http://leginfo.legislature.ca.gov/faces/codes.xhtml"
    end

    def visit_section(section_title)
      visit_home
      click_link section_title
    end

    def visit_code(section_title, code_title)
      visit_section(section_title)
      click_link code_title
    end

    def visit_division(section_title, code_title, division_title)
      visit_code(section_title, code_title)
      click_link division_title
    end

    def get_sections
      visit_home

      all('.portletNav').each do |chapter|
        title = chapter.text
        @section_titles << title
      end
    end

    def handle_parts(parts)
      parts.each_with_index do |law, index|
        begin
          title = law.find('h6')
        rescue
          next
        end

        puts title.text.underline
        puts law.text.sub(title.text, '').strip
      end
    end

    def loop_through_sections
      @section_titles.each do |section_title|
        puts "Visiting #{section_title}".bold.blue

        visit_section(section_title)

        codes = []

        all('.codes_toc_list').each do |division|
          puts division.text
          codes << division.text
        end

        codes.each do |code_title|
          visit_code(section_title, code_title)

          parts = all('#manylawsections div div')

          if parts.count > 0
            handle_parts(parts)
          else
            divisions = []

            all('#expandedbranchcodesid div div').each do |division_title|
              divisions << division_title.text
            end

            divisions.each do |division_title|
              next unless division_title.downcase.include?("chapter")

              visit_division(section_title, code_title, division_title)

              begin
                parts = all('#manylawsections div div')
                handle_parts(parts)
              rescue
                puts "shit went wrong with #{division_title}"
              end
            end
          end
        end

      end
    end

end

client = CaliLaws.new
client.run

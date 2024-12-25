from experta import KnowledgeEngine, Rule, Fact

class Recommendation(Fact):
    """Fact for generating recommendations."""
    pass

class KnowledgeBaseEngine(KnowledgeEngine):

    def __init__(self):
        super().__init__()
        self.level_name = None

    def map_level_to_name(self, level):
        if level <= 0.33:
            self.level_name = "beginner"
        elif level <= 0.66:
            self.level_name = "intermediate"
        else:
            self.level_name = "advanced"

    # Rules with resource IDs instead of names
    @Rule(Recommendation(topic="Math", level="beginner"))
    def math_beginner(self):
        self.declare(Fact(resource=1))  # Algebra Basics Video

    @Rule(Recommendation(topic="Math", level="intermediate"))
    def math_intermediate(self):
        self.declare(Fact(resource=2))  # Geometry Practice Exercises

    @Rule(Recommendation(topic="Math", level="advanced"))
    def math_advanced(self):
        self.declare(Fact(resource=3))  # Advanced Calculus Article

    @Rule(Recommendation(topic="Physics", level="beginner"))
    def physics_beginner(self):
        self.declare(Fact(resource=4))  # Mechanics Crash Course

    @Rule(Recommendation(topic="Physics", level="intermediate"))
    def physics_intermediate(self):
        self.declare(Fact(resource=5))  # Thermodynamics Exercises

    @Rule(Recommendation(topic="Physics", level="advanced"))
    def physics_advanced(self):
        self.declare(Fact(resource=6))  # Optics Advanced Problems

    @Rule(Recommendation(topic="Chemistry", level="beginner"))
    def chemistry_beginner(self):
        self.declare(Fact(resource=7))  # Introduction to Organic Chemistry

    @Rule(Recommendation(topic="Chemistry", level="intermediate"))
    def chemistry_intermediate(self):
        self.declare(Fact(resource=8))  # Physical Chemistry Exercises

    @Rule(Recommendation(topic="Chemistry", level="advanced"))
    def chemistry_advanced(self):
        self.declare(Fact(resource=9))  # Inorganic Chemistry Deep Dive

    @Rule(Recommendation(topic="Biology", level="beginner"))
    def biology_beginner(self):
        self.declare(Fact(resource=10))  # Genetics Basics Video

    @Rule(Recommendation(topic="Biology", level="intermediate"))
    def biology_intermediate(self):
        self.declare(Fact(resource=11))  # Molecular Biology Exercises

    @Rule(Recommendation(topic="Biology", level="advanced"))
    def biology_advanced(self):
        self.declare(Fact(resource=12))  # Evolution Advanced Concepts

    @Rule(Recommendation(topic="Programming", level="beginner"))
    def programming_beginner(self):
        self.declare(Fact(resource=13))  # Python for Beginners

    @Rule(Recommendation(topic="Programming", level="intermediate"))
    def programming_intermediate(self):
        self.declare(Fact(resource=14))  # JavaScript Exercises

    @Rule(Recommendation(topic="Programming", level="advanced"))
    def programming_advanced(self):
        self.declare(Fact(resource=15))  # Advanced Algorithm Design

    @Rule(Recommendation(topic="Data Science", level="beginner"))
    def data_science_beginner(self):
        self.declare(Fact(resource=16))  # Statistics Basics Video

    @Rule(Recommendation(topic="Data Science", level="intermediate"))
    def data_science_intermediate(self):
        self.declare(Fact(resource=17))  # Machine Learning Exercises

    @Rule(Recommendation(topic="Data Science", level="advanced"))
    def data_science_advanced(self):
        self.declare(Fact(resource=18))  # Data Visualization Techniques

    @Rule(Recommendation(topic="History", level="beginner"))
    def history_beginner(self):
        self.declare(Fact(resource=19))  # World History Overview

    @Rule(Recommendation(topic="History", level="intermediate"))
    def history_intermediate(self):
        self.declare(Fact(resource=20))  # Ancient Civilizations Exercises

    @Rule(Recommendation(topic="History", level="advanced"))
    def history_advanced(self):
        self.declare(Fact(resource=21))  # Modern Events Analysis

    @Rule(Recommendation(topic="Literature", level="beginner"))
    def literature_beginner(self):
        self.declare(Fact(resource=22))  # Introduction to Shakespeare

    @Rule(Recommendation(topic="Literature", level="intermediate"))
    def literature_intermediate(self):
        self.declare(Fact(resource=23))  # Poetry Analysis Exercises

    @Rule(Recommendation(topic="Literature", level="advanced"))
    def literature_advanced(self):
        self.declare(Fact(resource=24))  # Modern Literary Trends

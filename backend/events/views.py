from rest_framework import viewsets,status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import Event, Registration, Skill
from .serializers import EventSerializer, RegistrationSerializer, SkillSerializer

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

    @action(detail=True, methods=['post'])
    def register(self, request, pk=None):
        """
        Accepts: { "username": "...", "email": "...", "skills": "s1,s2" } (skills can be list too)
        Creates or reuses a User (unusable password), creates Skill entries, creates Registration.
        """
        event = self.get_object()
        username = request.data.get('username') or request.data.get('name')
        email = request.data.get('email')
        skills = request.data.get('skills', [])

        if not email:
            return Response({'error': 'email is required'}, status=status.HTTP_400_BAD_REQUEST)

        user, created = User.objects.get_or_create(
            email=email,
            defaults={'username': username or email.split('@')[0]}
        )
        if created:
            user.set_unusable_password()
            user.save()
        else:
            # update username if provided
            if username and user.username != username:
                user.username = username
                user.save()

        # Normalize skills to list
        if isinstance(skills, str):
            skills_list = [s.strip() for s in skills.split(',') if s.strip()]
        else:
            skills_list = skills

        for s in skills_list:
            Skill.objects.get_or_create(user=user, name=s)

        reg, reg_created = Registration.objects.get_or_create(user=user, event=event)
        serializer = RegistrationSerializer(reg)

        return Response(serializer.data,
                        status=status.HTTP_201_CREATED if reg_created else status.HTTP_200_OK)

    @action(detail=True, methods=['get'])
    def recommendations(self, request, pk=None):
        """
        Simple greedy team formation: try to maximize skill diversity.
        Returns: { "teams": [["user1","user2"], ["user3","user4"], ...] }
        """
        event = self.get_object()
        regs = Registration.objects.filter(event=event).select_related('user')
        users = [r.user for r in regs]

        # helper: overlap count between two users
        def user_skills(u):
            return set(Skill.objects.filter(user=u).values_list('name', flat=True))

        def overlap(u1, u2):
            return len(user_skills(u1) & user_skills(u2))

        unassigned = users.copy()
        teams = []
        max_size = getattr(event, 'max_team_size', 4)  # fallback to 4 if field not present

        while unassigned:
            leader = unassigned.pop(0)
            team = [leader]
            # sort remaining by overlap with current leader (least overlap preferred)
            candidates = sorted(unassigned, key=lambda u: overlap(leader, u))
            for c in candidates:
                if len(team) >= max_size:
                    break
                team.append(c)
                unassigned.remove(c)
            teams.append([u.username for u in team])

        return Response({'teams': teams})

class RegistrationViewSet(viewsets.ModelViewSet):
    queryset = Registration.objects.all()
    serializer_class = RegistrationSerializer

class SkillViewSet(viewsets.ModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
